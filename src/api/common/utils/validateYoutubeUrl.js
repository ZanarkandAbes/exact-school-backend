const validateYouTubeUrl = (url) => {

  if (!!url || url !== '') {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/

    return regExp.test(url)
  }
  return false
}

module.exports = validateYouTubeUrl