export type User = {
	id?: number,
	name: string,
	email: string,
	password: string,
	type: 'admin' | 'default'
}

export type UserRead = Omit<User, 'password'>;

export type AuthData = Pick<User, 'email' | 'password'>;

export type JWTPayload = Omit<User, 'id'| 'password'>  & {
	sub: string,
	iat: number,
	exp: number
}

export type UserResetPass = {
	password_old: string, 
	password_new: string
}

export type Stats = {
	shopping_quantity: number,
	store_quantity: number,
	shopping_store_total: number,
	recent_visits: number
}