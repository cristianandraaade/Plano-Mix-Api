import { Classification, Segment, Activity, Mix  } from "../Lib/Database/Prisma.ts";
import type { Classification as ClassificationData, Segment as SegmentData, Activity as ActivityData, Mix as MixData } from "../Types/Classification.ts";



class ClassificationRepository {

    // funções da parte de classificação
    public getAll = async (): Promise<MixData[]> => {
        return await Mix.findMany();
    }

    public getById = async (id: number): Promise<MixData | null> => {
        return await Mix.findFirst({
            where: { classification_id: id }
        })
    }

    public getByName = async (name: string): Promise<number> => {
        return await Classification.count({
            where: { name: name }
        })
    }

    public createOneClassification = async (classificationData: ClassificationData): Promise<number> => {
        const classification = await Classification.create({
            data: classificationData,
            select: { id: true }
        })
        return classification.id
    }

    public createManyClassification = async (classificationData: ClassificationData[]): Promise<number> => {
        const classification = await Classification.createMany({
            data: classificationData,
        })
        return classification.count
    }

    public updateClassification = async (id: number, dataToUpdate: ClassificationData): Promise<boolean> => {
        const updated = await Classification.update({
            data: dataToUpdate,
            where: { id: id }
        })
        return !!updated
    }

    public deleteClassification = async (id: number): Promise<boolean> => {
        const deleted = await Classification.delete({
            where: { id: id }
        })
        return !!deleted
    }

    // funções da parte do seguimento

    public getByClassificationId = async (segmentName: string, classification_id: number): Promise<number> => {
        return await Segment.count({
            where: {
                classification_id: classification_id,
                name: segmentName
            }
        })
    }

    public createOneSegment = async (segmentData: SegmentData): Promise<number> => {
        const segment = await Segment.create({
            data: segmentData,
            select: { id: true }
        })
        return segment.id
    }

    public createManySegments = async (segmentData: SegmentData[]): Promise<number> => {
        const segments = await Segment.createMany({
            data: segmentData,
        })
        return segments.count;
    }

    public updateSegment = async (id: number, dataToUpdate: SegmentData): Promise<boolean> => {
        const updated = await Segment.update({
            data: dataToUpdate,
            where: { id: id }
        })
        return !!updated
    }

    public deleteSegment = async (id: number): Promise<boolean> => {
        const deleted = await Segment.delete({
            where: { id: id }
        })

        return !!deleted
    }

    // funções da atividade

    public getBySegmentId = async (activityName: string, segment_id: number): Promise<number> => {
        return await Activity.count({
            where: {
                segment_id: segment_id,
                name: activityName
            }
        })
    }

    public createActivity = async (activityData: ActivityData): Promise<number> => {
        const activity = await Activity.create({
            data: activityData,
            select: { id: true }
        })
        return activity.id
    }

    public createManyActivities = async (activityData: ActivityData[]): Promise<number> => {
        const activities = await Activity.createMany({
            data: activityData,
        })
        return activities.count;
    }

    public updateActivity = async (id: number, dataToUpdate: ActivityData): Promise<boolean> => {
        const updated = await Activity.update({
            data : dataToUpdate,
            where: {id : id}
        })
        return !!updated
    }

    public deleteActivity = async (id: number): Promise<boolean> => {
        const deleted = await Activity.delete({
            where: { id: id }
        })
        return !!deleted
    }
}
export default ClassificationRepository;