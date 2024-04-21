const cssmap = {}

export function css(strings, ...values) {
    let str = ''
    for (let f of strings) {
        str += f + (values.shift() || '')
    }

    let cached = cssmap[str]
    if (cached) return cached

    const uid = `dl${Array(5)
        .fill(0)
        .map(() => {
            return Math.floor(Math.random() * 36).toString(36)
        })
        .join('')}`

    cssmap[str] = uid
    const styleElement = document.createElement('style')
    document.head.appendChild(styleElement)

    let newstr = ''
    let selfstr = ''

    // compat layer for older browsers. when css nesting stablizes this can be removed
    str += '\n'
    for (;;) {
        let [first, ...rest] = str.split('\n')
        if (first.trim().endsWith('{')) break

        selfstr += first + '\n'
        str = rest.join('\n')
        if (!str) break
    }
    styleElement.textContent = str

    for (const rule of styleElement.sheet.cssRules) {
        rule.selectorText = `.${uid} ${rule.selectorText}`
        newstr += rule.cssText + '\n'
    }

    styleElement.textContent = `.${uid} {${selfstr}}` + '\n' + newstr

    return uid
}
