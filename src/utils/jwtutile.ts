import * as jwt from 'jsonwebtoken';

const EXPIRE_DURATION_ACCESS = 60 * 60; // 1 hour in seconds
const EXPIRE_DURATION_REFRESH = 24 * 60 * 60; // 24 hours in seconds

class JwtTokenUtil {
  private secret_access: any;
  private secret_refresh: any;
  private id: any;

  constructor(secret_access: any, secret_refresh: any ,id:any) {
    this.secret_access = secret_access;
    this.secret_refresh = secret_refresh;
    this.id = id;
  }

  public generateToken(jwtTokenRequest: JwtTokenRequest): any {
    const EXPIRE_DURATION =
      jwtTokenRequest.jwtIssuer === 'HelloAI_Access'
        ? EXPIRE_DURATION_ACCESS
        : EXPIRE_DURATION_REFRESH;

    const token = jwt.sign(
      {
        sub: jwtTokenRequest.subject,
        iss: jwtTokenRequest.jwtIssuer,
        id:jwtTokenRequest.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + EXPIRE_DURATION,
      },
      this.getSecretKeyByIssuerType(jwtTokenRequest.jwtIssuer),
      { algorithm: 'HS512' }
    );

    return token;
  }

  public validateToken(req: JwtTokenParseRequest): boolean {
    const token = this.extractTokenFromRequest(req);
    if (!token) {
      return false;
    }

    try {
      jwt.verify(token, this.getSecretKeyByIssuerType(req.jwtIssuerType), {
        algorithms: ['HS512'],
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromRequest(req: JwtTokenParseRequest): string | null {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    return null;
  }

  private getSecretKeyByIssuerType(jwtIssuerType: string): string {
    return jwtIssuerType === 'HelloAI_Access' ? this.secret_access : this.secret_refresh;
  }

  public parseSubjectFromToken(token: string, jwtIssuerType: string): string {
    const decoded:any = jwt.verify(token, this.getSecretKeyByIssuerType(jwtIssuerType), {
      algorithms: ['HS512'],
    });
    return decoded.sub;
  }

  public parseExpirationFromToken(token: string, jwtIssuerType: string): number {
    const decoded:any = jwt.verify(token, this.getSecretKeyByIssuerType(jwtIssuerType), {
      algorithms: ['HS512'],
    });

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  }
}

interface JwtTokenRequest {
  subject: string;
  jwtIssuer: string;
  id:any
}

interface JwtTokenParseRequest {
  jwtIssuerType: string;
  headers: { [key: string]: string };
}

export default JwtTokenUtil;
