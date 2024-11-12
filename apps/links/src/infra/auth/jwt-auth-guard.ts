import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    // Se a rota for pública, mas um token for enviado, tenta validar o token
    if (isPublic && token) {
      return super.canActivate(context) as Promise<boolean>
    }

    // Se a rota é pública e não tem token, permite o acesso sem autenticação
    if (isPublic && !token) {
      return true
    }

    // Para rotas privadas, exigir autenticação
    return super.canActivate(context) as Promise<boolean>
  }
}
