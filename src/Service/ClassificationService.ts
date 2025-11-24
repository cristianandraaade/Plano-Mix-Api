import z, { string } from "zod";
import ClassificationRepository from "../Repository/ClassificationRepository.ts";
import type { Classification, ClassificationRead, Segment, Activity, Mix } from "../Types/Classification.ts";

class ClassificationService {
    private repository: ClassificationRepository;

    public constructor() {
        this.repository = new ClassificationRepository;
    }

    public getAllMix = async (): Promise<Mix[]> => {
        return await this.repository.getAll();
    }

    public getMixById = async (id: number): Promise<Mix | null> => {
        return await this.repository.getById(id);
    }

    public canCreateClassification = (reqBody?: Classification): boolean => {
        const validations = z.object({
            name: z.string()
        })
        return validations.safeParse(reqBody).success;
    }

    public classificationExist = async (name: string): Promise<boolean> => {
        const exist = await this.repository.getByName(name);
        return exist > 0;
    }

    public createClassification = async (classificationData: Classification): Promise<number> => {
        return await this.repository.createOneClassification(classificationData);
    }

    public createManyClassifications = async (classificationData: Classification[]): Promise<number> => {
        return await this.repository.createManyClassification(classificationData)
    }

    public updateClassification = async (id: number, updateData: Classification): Promise<boolean> => {
        return await this.repository.updateClassification(id, updateData);
    }

    public deleteClassification = async (id: number): Promise<boolean> => {
        return await this.repository.deleteClassification(id);
    }

    public canCreateSegment = (reqBody?: Segment): boolean => {
        const validations = z.object({
            name: z.string(),
            classification_id: z.number().int()
        });
        return validations.safeParse(reqBody).success
    }

    public segmentExist = async (segmentName: string, classification_id: number): Promise<boolean> => {
        const exist = await this.repository.getByClassificationId(segmentName, classification_id);
        return exist > 0;
    }

    public createSegment = async (segmentData: Segment): Promise<number> => {
        return await this.repository.createOneSegment(segmentData);
    }

    public createManySegments = async (segmentData: Segment[]): Promise<number> => {
        return await this.repository.createManySegments(segmentData);
    }

    public updateSegment = async (id: number, segmentData: Segment): Promise<boolean> => {
        return await this.repository.updateSegment(id, segmentData);
    }

    public deleteSegment = async (id: number): Promise<boolean> => {
        return await this.repository.deleteSegment(id);
    }

    // funções de atividades
    public canCreateActivity = (reqBody?: Activity): boolean => {
        const validations = z.object({
            name: z.string(),
            segment_id: z.number().int()
        });
        return validations.safeParse(reqBody).success;
    }

    public activityExist = async (activituName: string, segment_id: number): Promise<boolean> => {
        const exist = await this.repository.getBySegmentId(activituName, segment_id);
        return exist > 0;
    }

    public createActivity = async (activityData: Activity): Promise<number> => {
        return await this.repository.createActivity(activityData);
    }

    public createManyActivities = async (activityData: Activity[]): Promise<number> => {
        return await this.repository.createManyActivities(activityData);
    }

    public updateActivity = async (id: number, dataToUpdate: Activity): Promise<boolean> => {
        return await this.repository.updateActivity(id, dataToUpdate);
    }

    public deleteActivity = async (id: number): Promise<boolean> => {
        return await this.repository.deleteActivity(id);
    }
}
export default ClassificationService;