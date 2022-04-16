



function tidyData(tempData) {

  tempData = tempData.map( (item) =>  {
    
    let image = {
      id: item.id,
      date: item.date,
      description: item.description,
      images: item.images[0].b,
      label_text: item.label_text,
      medium: item.medium,
      title: item.title,
      url: item.url,
      year_end: item.year_end
    }    
    console.log("image: ", image)
    return image;
  }) 
  
}
exports.tidyData = tidyData