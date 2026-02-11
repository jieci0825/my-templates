/** 内部统一文件项（组件内部使用） */
export interface UploadFileItem {
    /** 唯一标识 */
    uid: string
    /** 文件名 */
    name: string
    /** 文件大小（字节） */
    size: number
    /** 原始 File 对象（新选择的文件） */
    raw?: File
    /** 预览/展示 URL */
    url: string
}
