import JcRequest from './request'
import { BASE_URL, TIME_OUT } from './config'
import { getStorage } from '@/utils'
import { STORAGE_KEY } from '@/constants'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { handleTokenExpired } from './token-refresh'
import axios from 'axios'

const jcRequest: JcRequest = new JcRequest({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    showLoading: false,
    interceptors: {
        requestInterceptor: (config) => {
            const token = getStorage(STORAGE_KEY.ACCESS_TOKEN)
            if (token) {
                config.headers && (config.headers.Authorization = token)
            }
            return config
        },
        responseInterceptor(res) {
            return res.data.data
        },
        async responseInterceptorsCatch(error) {
            const errInfo = error.response?.data
            ElMessage.error(errInfo.msg)

            if (errInfo?.code === 1002) {
                const { logout } = useUserStore()
                logout()
                return Promise.reject(error)
            }

            if (errInfo?.code === 1003) {
                const config = await handleTokenExpired(error)
                return axios.request(config)
            }

            return Promise.reject(error)
        },
    },
})

export default jcRequest
