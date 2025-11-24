import type { Request, Response } from "express";
import handleError from "../Lib/Error/Handle.ts";
import type { Activity, Classification, Segment } from "../Types/Classification.ts";
import ClassificationService from "../Service/ClassificationService.ts";


class ClassificationController {
    private service: ClassificationService;

    public constructor() {
        this.service = new ClassificationService();
    }

    public getAllMix = async (req: Request, res: Response): Promise<Response> => {
        try {
            const mixData = await this.service.getAllMix();
            return res.status(200).json({
                success: true,
                data: mixData
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public getMixById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            const mixData = await this.service.getMixById(id);
            if (mixData == null) {
                return res.status(404).json({
                    success: false,
                    message: "Classificação não existe"
                })
            }
            return res.status(200).json({
                success: true,
                data: mixData
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createClassification = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateClassification = this.service.canCreateClassification(req.body);
            if (canCreateClassification == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para inserir Classificação"
                })
            }
            const classificationData: Classification = req.body;
            const classificationExist = await this.service.classificationExist(classificationData.name);
            if (classificationExist == true) {
                return res.status(409).json({
                    success: false,
                    message: "Essa classificação já foi adicionada"
                })
            }
            await this.service.createClassification(classificationData);
            return res.status(201).json({
                success: true,
                message: "Classificação adicionado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createManyClassifications = async (req: Request, res: Response): Promise<Response> => {
        try {
            const classifications: Classification[] = req.body;
            if (Array.isArray(classifications) == false || classifications.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nenhuma classificação fornecida"
                })
            }
            const invalidItems = classifications.filter(
                (item) => this.service.canCreateClassification(item) == false
            );
            if (invalidItems.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Um ou mais itens invalidos"
                });
            }

            for (const item of classifications) {
                const exist = await this.service.classificationExist(item.name);
                if (exist == true) {
                    return res.status(400).json({
                        success: false,
                        message: `A classificação '${item.name}' já foi adicionada`
                    })
                }
            }

            await this.service.createManyClassifications(classifications);
            return res.status(201).json({
                success: true,
                message: "Classificações adicionadas com sucesso"
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateClassification = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const dataToUpdate: Classification = req.body;
        const canUpdateClassification = this.service.canCreateClassification(dataToUpdate);
        if (canUpdateClassification == false) {
            return res.status(400).json({
                success: false,
                message: "Dados invalidos para atualizar"
            })
        }

        const classificationExist = await this.service.classificationExist(dataToUpdate.name);
        if (classificationExist == true) {
            return res.status(409).json({
                success: false,
                message: "Classificação já cadastrada"
            })
        }

        await this.service.updateClassification(id, dataToUpdate);
        return res.status(200).json({
            success: true,
            message: "Classificação Atualizado com sucesso"
        })
    }

    public deleteClassification = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteClassification(id);
            return res.status(200).json({
                success: true,
                message: "Classificação deletada com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createSegment = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateSegment = this.service.canCreateSegment(req.body);
            if (canCreateSegment == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para inserir Segmento"
                })
            }
            const segmentData: Segment = req.body;
            const segmentExist = await this.service.segmentExist(segmentData.name, segmentData.classification_id);
            if (segmentExist == true) {
                return res.status(400).json({
                    success: false,
                    message: "Esse segmento já foi adicionado a essa classificação"
                })
            }
            await this.service.createSegment(segmentData);
            return res.status(201).json({
                success: true,
                message: "Segmento adicionado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createManySegments = async (req: Request, res: Response): Promise<Response> => {
        try {
            const segments: Segment[] = req.body;
            if (Array.isArray(segments) == false || segments.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nenhum segmento fornecido"
                })
            }
            const invalidSegments = segments.filter(
                (item) => this.service.canCreateSegment(item) == false
            );
            if (invalidSegments.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Um ou mais itens invalidos"
                });
            }

            for (const item of segments) {
                const exist = await this.service.segmentExist(item.name, item.classification_id);
                if (exist == true) {
                    return res.status(400).json({
                        success: false,
                        message: `O segmento '${item.name}' já foi adicionada`
                    })
                }
            }

            await this.service.createManySegments(segments);
            return res.status(201).json({
                success: true,
                message: "Segmentos adicionadas com sucesso"
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateSegment = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const dataToUpdate: Segment = req.body;
        const canUpdateSegment = this.service.canCreateSegment(dataToUpdate);
        if (canUpdateSegment == false) {
            return res.status(400).json({
                success: false,
                message: "Dados invalidos para atualizar"
            })
        }

        const segmentExist = await this.service.segmentExist(dataToUpdate.name, dataToUpdate.classification_id);
        if (segmentExist == true) {
            return res.status(409).json({
                success: false,
                message: "Segmento já cadastrada"
            })
        }

        await this.service.updateSegment(id, dataToUpdate);
        return res.status(200).json({
            success: true,
            message: "Segmento Atualizado com sucesso"
        })
    }

    public deleteSegment = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteSegment(id);
            return res.status(200).json({
                success: true,
                message: "Segmento deletado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    //funções de atividade
    public createActivity = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateActivity = this.service.canCreateActivity(req.body);
            if (canCreateActivity == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para inserir Atividade"
                })
            }
            const activityData: Activity = req.body;
            const activityExist = await this.service.activityExist(activityData.name, activityData.segment_id);
            if (activityExist == true) {
                return res.status(400).json({
                    success: false,
                    message: "Está atividade já foi adicionado a esse segmento"
                })
            }
            await this.service.createActivity(activityData);
            return res.status(201).json({
                success: true,
                message: "Atividade adicionado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createManyActivity = async (req: Request, res: Response): Promise<Response> => {
        try {
            const activities: Activity[] = req.body;
            if (Array.isArray(activities) == false || activities.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nenhuma atividade fornecida"
                })
            }
            const invalidActivities = activities.filter(
                (item) => this.service.canCreateActivity(item) == false
            );
            if (invalidActivities.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Um ou mais itens invalidos"
                });
            }
            for (const item of activities) {
                const exist = await this.service.activityExist(item.name, item.segment_id);
                if (exist == true) {
                    return res.status(400).json({
                        success: false,
                        message: `O segmento '${item.name}' já foi adicionada`
                    })
                }
            }
            await this.service.createManyActivities(activities);
            return res.status(201).json({
                success: true,
                message: "Atividades adicionadas com sucesso"
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateActivity = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const dataToUpdate: Activity = req.body;
        const canUpdateActivity = this.service.canCreateActivity(dataToUpdate);
        if (canUpdateActivity == false) {
            return res.status(400).json({
                success: false,
                message: "Dados invalidos para atualizar"
            })
        }
        const activityExist = await this.service.activityExist(dataToUpdate.name, dataToUpdate.segment_id);
        if (activityExist == true) {
            return res.status(409).json({
                success: false,
                message: "Atividade já cadastrada"
            })
        }
        await this.service.updateActivity(id, dataToUpdate);
        return res.status(200).json({
            success: true,
            message: "Atividade Atualizado com sucesso"
        })
    }

    public deleteActivity = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteActivity(id);
            return res.status(200).json({
                success: true,
                message: "Atividade deletado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

}



export default ClassificationController;