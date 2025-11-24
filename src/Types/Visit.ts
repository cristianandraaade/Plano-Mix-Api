import type { StoreWithClassification } from "./Store.ts"

export type Visit = {
    id: string,
    date: Date,
    observation: string,
    user_id: number,
    shopping_id: number,
    shopping_stores: VisitStore[]
}

export type VisitStore = {
    id: number | null,
    store_id: number,
    shopping_id: number,
    store_id_right: number,
    store_id_left: number,
    status: 'active' | 'deleted',
    action: "new" | "update" | "delete" | "none"
}

export type VisitRequest = Omit<Visit, 'id' | 'date' | 'user_id'>

export type VisitCreate = Omit<Visit, 'id' | 'shopping_stores'>

export type VisitHistoryStore = Omit<VisitStore, 'id' | 'shopping_id' | 'status' | 'action'>

export type VisitHistory = {
    visit_id: number,
    stores: VisitHistoryStore[]
}

export type VisitStoreCreate = Omit<VisitStore, 'id' | 'action'>

export type VisitStoreUpdate = VisitStoreCreate;

export type CompareVisitHistory = {
    visit1: StoreWithClassification[],
    visit2: StoreWithClassification[]
}

export type VisitDetails = {
    date: Date,
    observation: string | null,
    username: string,
    shopping_name: string,
}

export type VisitDetailsWithStores = VisitDetails & {
    stores: StoreWithClassification[]
}

export type VisitShopping = {
    date: Date,
    observation: string | null,
    username: string
}
