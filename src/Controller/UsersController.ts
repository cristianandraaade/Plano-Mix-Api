import type { Request, Response } from "express";
import UsersService from "../Service/UsersService.ts";
import type { User, AuthData, UserRead, UserResetPass } from "../Types/User.ts";
import handleError from "../Lib/Error/Handle.ts";
import { generateToken } from "../Lib/Auth/JWT.ts";
import TokenService from "../Service/TokenService.ts";
import { success } from "zod";

class UsersController {
    private service: UsersService;

    public constructor() {
        this.service = new UsersService();
    }

    public getAllUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userData = await this.service.getAllUsers();
            return res.status(200).json({
                success: true,
                data: userData
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public getStats = async (req: Request, res: Response): Promise<Response> => {
        try{
            const statsData = await this.service.getStats();
            return res.status(200).json({
                success: true,
                data: statsData
            });
        }
        catch(err){
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateUser = this.service.canValidateUser(req.body, "create");
            if (canCreateUser == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados inválidos para criar conta!"
                });
            }
            const userData: User = req.body;
            const userAlreadyExists = await this.service.userExists(userData.email);
            if (userAlreadyExists == true) {
                return res.status(409).json({
                    success: false,
                    message: "Já existe um usuário com esses dados!"
                });
            }

            await this.service.create(userData);
            return res.status(201).json({
                success: true,
                message: "Usuário criado com sucesso!"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const dataToUpdate = req.body;
        const canUpdataStore = this.service.canValidateUser(dataToUpdate, 'update');
        if (canUpdataStore == false) {
            return res.status(400).json({
                success: false,
                message: "Dados invalidos para atualizar"
            });
        }
        const userAlreadyExists = await this.service.userExists(dataToUpdate.email);
        if (userAlreadyExists == true) {
            return res.status(409).json({
                success: false,
                message: "Já existe um usuário com esses dados!"
            });
        }
        await this.service.updateUser(dataToUpdate, id)
        return res.status(200).json({
            success: true,
            message: "Usuário Atualizado com sucesso"
        })
    }

    public auth = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCheckAuth = this.service.canCheckAuth(req.body);
            if (canCheckAuth == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados inválidos para autenticação!"
                });
            }

            const authData: AuthData = { email: req.body.email, password: req.body.password };
            const exists = await this.service.userExists(authData.email);
            const isAuthenticated = exists == true ? await this.service.auth(authData) : false;

            if (isAuthenticated == false) {
                return res.status(401).json({
                    success: false,
                    message: "Usuário ou senha incorretos!"
                });
            }

            const user: UserRead = await this.service.getByEmail(authData.email);
            const jwtToken = await generateToken(user);

            return res.status(200).json({
                success: true,
                token: jwtToken
            });
        } catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public sendResetToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canSendEmail = this.service.canSendResetEmail(req.body);
            if (canSendEmail == false) {
                return res.status(400).json({
                    success: false,
                    message: "E-mail inválido!"
                });
            }

            const mailTo = req.body.email;
            await this.service.sendResetEmail(mailTo);

            return res.status(200).json({
                success: true,
                message: "Se o e-email existir, um link de redefinição de senha será enviado!"
            });
        } catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public resetPassword = async (req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.params.token;

            const tokenIsValid = await (new TokenService().validate(token!));
            if (tokenIsValid == false) {
                return res.status(400).json({
                    success: false,
                    message: "Token Inválido!"
                })
            }


            const userFromToken = await (new TokenService().getUserFromToken(token!));
            const canResetPassword = await this.service.canResetPassword(userFromToken, req.body);
            if (canResetPassword == false) {
                return res.status(400).json({
                    success: false,
                    message: "Senhas atual incorreta, ou nova inválida para troca!"
                })
            }

            const passToChange: UserResetPass = req.body!;
            await this.service.resetPassword(passToChange.password_new, userFromToken);
            await (new TokenService().setAsUsed(token!))

            return res.status(200).json({
                success: true,
                message: "Senha trocada com sucesso!"
            });
        } catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteUser(id);
            res.status(200).json({
                success: true,
                message: "Usuário deletado com sucesso"
            })
        } catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }
}

export default UsersController;