export type Store = {
    name: string,
    classification_id : number,
    segment_id : number,
    activity_id : number | null
    
}

export type StoreRead = Store & {
    id: number
}

export type StoreInShopping = {
    store_name: string,
    store_classification: string,
    store_segment: string,
    store_status: string
}

export type StoreWithClassification = {
    name: string,
    classification: string,
    segment: string,
    activity: string | null
}