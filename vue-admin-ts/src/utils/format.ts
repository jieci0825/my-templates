/**
 * 将字符串转换为 kebab-case 格式
 * @param input 输入字符串
 * @returns kebab-case 格式的字符串
 * @example
 * toKebabCase('HelloWorld') // 'hello-world'
 * toKebabCase('foo_bar baz') // 'foo-bar-baz'
 */
export function toKebabCase(input: string): string {
    if (!input) return ''
    return String(input)
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
}

/**
 * 将字符串转换为 camelCase 格式
 * @param input 输入字符串
 * @returns camelCase 格式的字符串
 * @example
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('foo_bar baz') // 'fooBarBaz'
 */
export function toCamelCase(input: string): string {
    if (!input) return ''
    const kebab = toKebabCase(input)
    return kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/**
 * 将字符串转换为 PascalCase 格式
 * @param input 输入字符串
 * @returns PascalCase 格式的字符串
 * @example
 * toPascalCase('hello-world') // 'HelloWorld'
 * toPascalCase('foo_bar baz') // 'FooBarBaz'
 */
export function toPascalCase(input: string): string {
    if (!input) return ''
    const camel = toCamelCase(input)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
}
