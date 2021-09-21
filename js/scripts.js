const createButton = document.getElementById('create-button');
const searchInput = document.getElementById('search-input');

function WebState() {
  let currentState;

  this.start = function () {
    this.change(new HomeState());
  };

  this.change = function (state) {
    currentState = state;
  };
}

function HomeState() {
  let posts;
  let tags = [];
  let featuredContent = '';
  let featuredColumnContent = '';
  let remainingContent = '<hr>';

  searchInput.value = '';

  if (localStorage.getItem('posts') !== null) {
    posts = JSON.parse(localStorage.getItem('posts'));

    if (posts.length > 0) {
      tags.push('None');
    }

    for (let post of posts) {
      tags = tags.concat(post.tags.split(','));
    }

    function filterTags(tagsArray) {
      let found = {};
      let newArray = tagsArray.filter((tag) => {
        return found.hasOwnProperty(tag) ? false : (found[tag] = true);
      });
      return newArray;
    }

    const uniqueTags = filterTags(tags);
    const tagsUl = document.createElement('ul');
    let tagsLis = '';

    tagsUl.className = 'tags-list container';
    tagsUl.addEventListener('click', filterByTags);

    for (let tag of uniqueTags) {
      tagsLis += `
        <li><a class="tag" href="#">${tag}</a></li>
      `;
    }

    tagsUl.innerHTML = tagsLis;

    posts = posts.sort((a, b) => {
      return new Date(b.creationDate) - new Date(a.creationDate);
    });

    const featuredDiv = document.createElement('div');
    const featuredColumn = document.createElement('div');
    const remainingDiv = document.createElement('div');
    featuredDiv.className = 'featured-div large-container';
    featuredColumn.className = 'featured-column-div';
    remainingDiv.className = 'remaining-div container';
    featuredDiv.addEventListener('click', showPost);
    remainingDiv.addEventListener('click', showPost);

    for (let i = 0; i < posts.length; i++) {
      let creationDate = new Date(posts[i].creationDate).toLocaleString(
        'en-US'
      );
      let someInformation = '';

      if (posts[i].body.length >= 40) {
        for (let j = 0; j < 40; j++) {
          someInformation += posts[i].body[j];
        }
      } else {
        someInformation = posts[i].body;
      }

      if (i < 5) {
        if (i < 1) {
          featuredContent += `
            <div class="post-card">
              <img src="${posts[i].imageUrl}">
              <a class="post-title" href="#">${posts[i].title}</a>
              <p>${someInformation}...</p>
              <p>ID: <span>${posts[i].id}</span> | ${creationDate}</p>
            </div>
          `;
        } else if (i > 3) {
          featuredContent += `
            <div class="post-card last-post">
              <img src="${posts[i].imageUrl}">
              <a class="post-title" href="#">${posts[i].title}</a>
              <p>${someInformation}...</p>
              <p>ID: <span>${posts[i].id}</span> | ${creationDate}</p>
            </div>
          `;
        } else {
          featuredColumnContent += `
            <div class="column-card">
              <div>
                <img src="${posts[i].imageUrl}">
              </div>
              <div class="column-card-information">
                <a class="post-title" href="#">${posts[i].title}</a>
                <p>${someInformation}...</p>
                <p>ID: <span>${posts[i].id}</span> | ${creationDate}</p>    
              </div>
            </div>
          `;
        }
      } else {
        remainingContent += `
          <div class="horizontal-post-card">
            <div>
              <img src="${posts[i].imageUrl}">
            </div>
            <div class="post-information">
              <a class="post-title" href="#">${posts[i].title}</a>
              <p>${someInformation}...</p>
              <p>ID: <span>${posts[i].id}</span> | ${creationDate}</p>    
            </div>  
          </div>
        `;
      }
    }

    featuredColumn.innerHTML = featuredColumnContent;
    featuredDiv.innerHTML = featuredContent;
    featuredDiv.appendChild(featuredColumn);
    remainingDiv.innerHTML = remainingContent;
    document.getElementById('main-div').innerHTML = '';
    document.getElementById('main-div').appendChild(tagsUl);
    document.getElementById('main-div').appendChild(featuredDiv);
    document.getElementById('main-div').appendChild(remainingDiv);
  }
}

function CreateState(postID) {
  document.getElementById('main-div').innerHTML = `
    <form id="post-form" class="post-form container" method="POST">
      <div>
        <label>Image (URL)</label>
        <input id="image-input" type="text" placeholder="URL" />
      </div>
      <div>
        <label>Title</label>
        <input id="title-input" type="text" placeholder="Title of the post" />
      </div>
      <div>
        <label>Body</label>
        <textarea id="body-input"></textarea>
      </div>
      <div>
        <label>Tags (separated by comma)</label>
        <input id="tags-input" type="text" placeholder="Tags" />
      </div>
      <button>Save</button>
    </form>
  `;

  const postForm = document.getElementById('post-form');
  const imageUrlInput = document.getElementById('image-input');
  const titlelInput = document.getElementById('title-input');
  const bodylInput = document.getElementById('body-input');
  const tagslInput = document.getElementById('tags-input');

  postForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (imageUrlInput.value === '') {
      alert('You have to enter an image URL');
    } else if (titlelInput.value === '') {
      alert('You have to enter a title');
    } else if (bodylInput.value === '') {
      alert('You have to enter a body');
    } else if (tagslInput.value === '') {
      alert('You have to enter at list one tag');
    } else {
      const newPost = {};
      let posts;
      let id;

      if (localStorage.getItem('posts') === null) {
        posts = [];
        id = 1;
      } else {
        posts = JSON.parse(localStorage.getItem('posts'));

        if (postID === undefined) {
          id = parseInt(localStorage.getItem('id')) + 1;
        } else {
          id = postID;
        }
      }

      newPost.id = id;
      newPost.imageUrl = imageUrlInput.value;
      newPost.title = titlelInput.value;
      newPost.body = bodylInput.value;
      newPost.tags = tagslInput.value;
      newPost.creationDate = new Date();

      if (postID === undefined) {
        posts.push(newPost);

        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('id', id);
      } else {
        const updatedPosts = [];

        for (let post of posts) {
          if (post.id !== postID) {
            updatedPosts.push(post);
          } else {
            updatedPosts.push(newPost);
          }
        }

        localStorage.setItem('posts', JSON.stringify(updatedPosts));
      }

      web.change(new HomeState());
    }
  });
}

function SearchByNameState(name) {
  let searchedDiv = document.createElement('div');
  let searchedPosts = [];
  let mainContent = '';

  searchedDiv.className = 'container';

  if (localStorage.getItem('posts') === null) {
    posts = [];
  } else {
    posts = JSON.parse(localStorage.getItem('posts'));
  }

  for (let post of posts) {
    if (post.title.toLowerCase().includes(name.toLowerCase())) {
      searchedPosts.push(post);
    }
  }

  for (let post of searchedPosts) {
    let creationDate = new Date(post.creationDate).toLocaleString('en-US');

    mainContent += `
      <div class="horizontal-post-card">
        <div>
          <img src="${post.imageUrl}">
        </div>
        <div class="post-information">
          <a class="post-title" href="#">${post.title}</a>
          <p>${post.body}</p>
          <p>ID: <span>${post.id}</span> | ${creationDate}</p>
        </div>
      </div>
    `;
  }

  searchedDiv.innerHTML = mainContent;
  searchedDiv.addEventListener('click', showPost);
  document.getElementById('main-div').innerHTML = '';
  document.getElementById('main-div').appendChild(searchedDiv);
}

function FilterByTagState(tag) {
  const posts = JSON.parse(localStorage.getItem('posts'));
  const filteredDiv = document.createElement('div');
  let tags = ['None'];
  let filteredPosts = [];
  let mainContent = '';

  filteredDiv.className = 'container';

  for (let post of posts) {
    tags = tags.concat(post.tags.split(','));
  }

  function filterTags(tagsArray) {
    let found = {};
    let newArray = tagsArray.filter((tag) => {
      return found.hasOwnProperty(tag) ? false : (found[tag] = true);
    });
    return newArray;
  }

  const uniqueTags = filterTags(tags);
  const tagsUl = document.createElement('ul');
  let tagsLis = '';

  tagsUl.className = 'tags-list container';
  tagsUl.addEventListener('click', filterByTags);

  for (let tag of uniqueTags) {
    tagsLis += `
      <li><a class="tag" href="#">${tag}</a></li>
    `;
  }

  tagsUl.innerHTML = tagsLis;

  for (let post of posts) {
    if (post.tags.split(',').includes(tag)) {
      filteredPosts.push(post);
    }
  }

  for (let post of filteredPosts) {
    let creationDate = new Date(post.creationDate).toLocaleString('en-US');

    mainContent += `
      <div class="horizontal-post-card">
        <div>
          <img src="${post.imageUrl}">
        </div>
        <div class="post-information">
          <a class="post-title" href="#">${post.title}</a>
          <p>${post.body}</p>
          <p>ID: <span>${post.id}</span> | ${creationDate}</p>
        </div>
      </div>
    `;
  }

  filteredDiv.innerHTML = mainContent;
  filteredDiv.addEventListener('click', showPost);
  document.getElementById('main-div').innerHTML = '';
  document.getElementById('main-div').appendChild(tagsUl);
  document.getElementById('main-div').appendChild(filteredDiv);
}

function ShowPostState(postID) {
  const posts = JSON.parse(localStorage.getItem('posts'));
  let mainContent = '';

  for (let post of posts) {
    if (post.id === parseInt(postID)) {
      let creationDate = new Date(post.creationDate).toLocaleString('en-US');

      mainContent += `
        <div class="post-showed container">
          <a class="post-title-showed" href="#">${post.title}</a>
          <p>${creationDate}</p>
          <img src="${post.imageUrl}">
          <p>${post.body}</p>
          <p>Tags: ${post.tags}</p>
          <div class="buttons-div">
            <button id="home-link" class="home-button">Home</button>
            <button id="delete-link" class="delete-button">Delete</button>
            <button id="edit-link" class="edit-button">Edit</button>
          </div>
        </div>
      `;
    }
  }
  document.getElementById('main-div').innerHTML = mainContent;

  document.getElementById('home-link').addEventListener('click', function () {
    web.change(new HomeState());
  });

  document.getElementById('delete-link').addEventListener('click', function () {
    const updatedPosts = [];

    for (let post of posts) {
      if (post.id !== parseInt(postID)) {
        updatedPosts.push(post);
      }
    }

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    web.change(new HomeState());
  });

  document.getElementById('edit-link').addEventListener('click', function () {
    web.change(new CreateState(parseInt(postID)));
  });
}

const web = new WebState();
web.start();

createButton.addEventListener('click', function (e) {
  e.preventDefault();

  web.change(new CreateState());
});

searchInput.addEventListener('keyup', function (e) {
  e.preventDefault();

  if (searchInput.value !== '') {
    web.change(new SearchByNameState(searchInput.value));
  } else {
    web.change(new HomeState());
  }
});

function filterByTags(e) {
  if (e.target.className === 'tag') {
    if (e.target.textContent === 'None') {
      web.change(new HomeState());
    } else {
      web.change(new FilterByTagState(e.target.textContent));
    }
  }
}

function showPost(e) {
  e.preventDefault();

  if (e.target.className === 'post-title') {
    const postId =
      e.target.nextElementSibling.nextElementSibling.querySelector(
        'span'
      ).textContent;

    web.change(new ShowPostState(postId));
  }
}
