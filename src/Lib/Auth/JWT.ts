import { SignJWT, jwtVerify } from "jose";
import type { UserRead, JWTPayload } from "../../Types/User.ts";


const getKey = () => {
  const envKey = process.env.JWT_SECRET;
  if(!envKey){
    throw new Error('JWT_SECRET está vazio!');
  }
  const secretKey = new TextEncoder().encode(envKey);
  return secretKey;
}

export const generateToken = async (payloadData: UserRead)  => {
    return await new SignJWT({ 
        sub: `${payloadData.id}`,
        name: payloadData.name,
        email: payloadData.email, 
        type: payloadData.type 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getKey());
}

export const tokenIsValid = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, getKey());
    return true;
  } catch {
    return false;
  }
}

export const getPayload = async (token: string): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(token, getKey());
    return payload as JWTPayload;
}
