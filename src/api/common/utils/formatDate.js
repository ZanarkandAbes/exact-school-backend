const formatDate = (date) => {
  let day = date.getDate().toString().padStart(2, '0'),
    month = (date.getMonth()+1).toString().padStart(2, '0'),
    year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

module.exports = formatDate