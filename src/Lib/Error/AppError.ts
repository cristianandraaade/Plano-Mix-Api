class AppError extends Error {
	constructor(public message: string, public status_code: number = 500) {
		super(message)
	}
}

export default AppError;