export const showErrorMessage = (title='请求失败',duration=1500,icon='none') => {
  uni.showToast({
    title,
    duration,
    icon
  })
}