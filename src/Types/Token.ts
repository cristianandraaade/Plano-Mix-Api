export type Token = {
    id?: number,
    user_id: number,
    token_hash: string,
    created_at?: Date
    expires_at: Date,
    used: boolean
}