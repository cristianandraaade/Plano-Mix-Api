export type Classification = {
    name: string
}
export type ClassificationRead = Classification & {
    id : number
}
export type Segment = {
    id: number,
    name: string,
    classification_id: number
}
export type Activity = {
    id: number,
    name: string,
    segment_id: number
}
export type Mix = {
    classification_id: number,
    classification: string,
    segment_id: number,
    segment: string,
    activity_id: number | null,
    activity: string | null
}