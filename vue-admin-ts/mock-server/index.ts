import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import { cors } from './middlewares/cors'
import authRouter from './routes/auth'
import userRouter from './routes/user'

const app = new Koa()
const PORT = 3100

app.use(cors)
app.use(bodyParser())

app.use(authRouter.routes()).use(authRouter.allowedMethods())
app.use(userRouter.routes()).use(userRouter.allowedMethods())

app.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`)
})
