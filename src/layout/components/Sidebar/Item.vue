<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    let { icon, title } = context.props
    const vnodes = []

    if (!icon) {
      icon = 'example'
    }

    vnodes.push(<svg-icon icon-class={icon} />)

    if (!title) {
      title = '未命名'
    }
    vnodes.push(<span slot='title'>{(title)}</span>)

    return vnodes
  }
}
</script>
