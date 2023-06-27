export function build ({ propsString, content }) {
  return `<div class="pro-table" ${propsString} data-gen-vue>${content}</div>`
}
