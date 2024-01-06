

document.addEventListener('DOMContentLoaded', function () {
    // Fetch news from the server when the page loads
    fetchNews();

    
    // Function to fetch and display news
    function fetchNews() {
              fetch('/api/upload')
            .then(response => response.json())
            .then(newsList => {
                // Iterate through the news list and display each item
                newsList.forEach(newsItem => {
                    // console.log(newsItem.title,"+",newsItem._id)
                    if (newsItem.content != null){

                    const newsDiv = document.createElement('div');
                    newsDiv.className = "container";
                    newsDiv.innerHTML = `
                        <div class="row">
                          <div class="col-sm-4 col-md-11 col-lg-12" style="text-align: center; border:1px solid black; padding:10px; border-radius: 20px; margin:10px; background-color: lightcyan; ">
                            <div class="news-container post1" data-post-id="0">
                            <h3><b>${newsItem.title}</b></h3>
                            <p>${newsItem.content}</p>
                            <img src="/${newsItem.image}" alt="${" "} " style="width:500px; height:500px;">
                            <p><b>${newsItem.time}</p>
                            
                            <div class="post-ratings-container">
                                <div class="post-rating">
                                    <span class="post-rating-button material-icons">thumb_up</span>
                                    <span class="post-rating-count"><input name="${'lik'+newsItem._id}" type="text" value=${newsItem.like} readonly></span>
                                </div>
                                <div class="post-rating">
                                    <span class="post-rating-button material-icons">thumb_down</span>
                                    <span class="post-rating-count"><input name="${'dis'+newsItem._id}" type="text" value=${newsItem.dislike}  readonly></span>
                                </div>
                            </div>
                          </div>
                    `;
                    document.querySelector(".overall").insertBefore(newsDiv,document.querySelector(".overall .container:first-of-type"));
                    }

                        //assigning likes and dislikes to static news
                else{
                    console.log(newsItem.title)
                    let appointRating = document.querySelector(`input[name=${"lik"+newsItem._id}]`).value
                    console.log("Earlier like:",appointRating)
                    appointRating = newsItem.like.toString()
                    console.log("Now like:",appointRating)

                    appointRating = document.querySelector(`input[name=${"dis"+newsItem._id}]`).value
                    console.log("Earlier dislike:",appointRating)
                    appointRating = newsItem.dislike.toString()
                    console.log("Now dislike:",appointRating,"\n\n\n")

                }
                });
            })
            .catch(error => console.error('Error fetching news:', error));
    }
    
});