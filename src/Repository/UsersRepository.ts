import { Shopping, ShoppingStore, Store, User, Visit } from '../Lib/Database/Prisma.ts';
import type { Stats, UserRead, User as UserToCreate } from '../Types/User.ts';
class UsersRepository {


	public getAll = async (): Promise<UserRead[]> => {
		return await User.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				type: true
			}
		});
	}

	public getStats = async (): Promise<Stats> => {
		const [shopping_quantity, store_quantity, shopping_store_total, recent_visits] = await Promise.all([
			Shopping.count(),
			Store.count(),
			ShoppingStore.count(),
			Visit.count()
		]);

		return {
			shopping_quantity,
			store_quantity,
			shopping_store_total,
			recent_visits
		};
	}

	public create = async (userData: UserToCreate): Promise<number> => {
		const user = await User.create({
			data: userData,
			select: { id: true }
		})

		return user.id;
	}

	public exists = async (email: string): Promise<number> => {
		return await User.count({
			where: { email: email }
		});
	}

	public getPassByEmail = async (email: string): Promise<string> => {
		const user = await User.findFirst({
			where: { email: email },
			select: {
				password: true
			}
		})
		return user!.password;
	}

	public getByEmail = async (email: string): Promise<UserRead> => {
		const user = await User.findFirst({
			where: { email: email },
			select: {
				id: true,
				name: true,
				email: true,
				type: true
			}
		});
		return user!;
	}

	public getById = async (id: number): Promise<UserRead> => {
		const user = await User.findFirst({
			where: { id: id },
			select: {
				id: true,
				name: true,
				email: true,
				type: true
			}
		});
		return user!;
	}

	public getPasswordById = async (id: number): Promise<string> => {
		const user = await User.findFirst({
			where: { id: id },
			select: {
				password: true
			}
		});
		return user?.password!;
	}

	public updatePasswordById = async (user_id: number, new_password: string) => {
		await User.update({
			data: { password: new_password },
			where: { id: user_id }
		})
	}

	public delete = async (id: number): Promise<boolean> => {
		const deleted = await User.delete({
			where: { id: id }
		})
		return !!deleted
	}

	public update = async (userData: UserRead, id: number): Promise<boolean> => {
		const updated = await User.update({
			data: userData,
			where: { id: id }
		})
		return !!updated;
	}
}


export default UsersRepository;