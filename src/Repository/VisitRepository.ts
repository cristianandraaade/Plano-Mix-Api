import { History, Visit } from "../Lib/Database/Prisma.ts";
import type { VisitCreate, VisitDetails, VisitHistory, VisitHistoryStore, VisitShopping } from "../Types/Visit.ts";

class VisitRepository {


    public getAllVisits = async () => {
        return await Visit.findMany();
    }

public getVisitByShoppingId = async (id: number): Promise<VisitShopping[]> => {
    const visits = await Visit.findMany({
        where: {
            shopping_id: id
        },
        select: {
            date: true,
            observation: true,
            user: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            date: "desc"
        }
    });

    const formattedVisits: VisitShopping[] = visits.map(visit => ({
        date: visit.date, 
        observation: visit.observation ?? "", 
        username: visit.user?.name ?? "Desconhecido" 
    }));

    return formattedVisits;
}

    public getVisitById = async (id: number): Promise<number> => {
        return await Visit.count({
            where: {id : id}
        });
    }

    public getVisitDetails = async (id: number): Promise<VisitDetails> => {
        const visitDetails = await Visit.findUnique({
            where: { id: Number(id) },
            select: {
                date: true,
                observation: true,
                user: {
                    select: { name: true }
                },
                shopping: {
                    select: { name: true }
                }
            },
        });
        
        return {
            date: visitDetails!.date,
            observation: visitDetails!.observation,
            username: visitDetails!.user!.name,
            shopping_name: visitDetails!.shopping.name,
        }
    }

    public create = async (data: VisitCreate): Promise<number> => {
        const visit = await Visit.create({
            data: data,
            select: {
                id: true
            }
        });
        return visit.id;
    }

    public saveHistory = async (data: VisitHistory) => {
        await History.create({
            data: data
        });
    }

    public delete = async (id: number) => {
        await Visit.delete({
            where: { id: id }
        });
    }

    public getHistoryByVisit = async (id: number): Promise<VisitHistoryStore[]> => {
        const data = await History.findFirst({
            where: { visit_id: id },
            select: {
                stores: true
            }
        });
        if (data == null) {
            return [];
        }

        return data!.stores as VisitHistoryStore[];
    }
}

export default VisitRepository;