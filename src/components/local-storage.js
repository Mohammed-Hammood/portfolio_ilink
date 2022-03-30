const localStorageName = 'reviews-ik-portfolio-1a#';

export const addNewReview = ({surname, about=null, photo=null})=> {
    const data = JSON.parse(localStorage.getItem(localStorageName)) || createNewData({surname:surname, about:about});
    let itemFound = false;
    const item = {
        surname:surname,
        about:about,
        date:getFullDate(),
        photo:localStorage.getItem('image') || null,
    };
    for(let i = 0; i < data.length; i++){
        if(data[i].surname === item.surname){
            itemFound = true;
            break;
        }
    }
    if(itemFound){
        return false;
    }
    else{
        data.push(item);
        localStorage.setItem(localStorageName, JSON.stringify(data));
        return true;
    }
}
const createNewData = ({surname=null, about=null, photo=null})=> {
    const data = [];
    const newItem = {
        surname:surname,
        about:about,
        date:getFullDate(),
        photo:localStorage.getItem('image') || null
    }
    if(surname===null){localStorage.setItem(localStorageName, JSON.stringify([])); return [];}
    data.push(newItem);
    localStorage.setItem(localStorageName, JSON.stringify(data));
    return data;
}
export const getReviews = ()=> {
    const data = JSON.parse(localStorage.getItem(localStorageName)) || createNewData({});
    return data;
}
const getFullDate = ()=> {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const DISPLAY = (item)=> {return ((item < 10)?("0" + item.toString()): item.toString());  }
    return DISPLAY(day) + '.' + DISPLAY(month) + '.' + year.toString();
}
export const convertImageToBase64String = (image)=> {
    const reader = new FileReader();
    reader.addEventListener('load', function(){
        progressBar();
        localStorage.setItem('image', reader.result);
    }, false);
    if(image){
        reader.readAsDataURL(image)
    }
}
export const progressBar = ()=> {
    const progress = document.getElementById('progress-bar');
    const loader = document.getElementById('loader-container');
    const trashIcon = document.getElementById('file-delete-container');
    loader.classList.remove('hidden');
    loader.classList.add('show-f');
    trashIcon.classList.add('hidden');
    trashIcon.classList.remove('show-f');
    let width = 10;
    const timer = setInterval(() => {
        if(width >= 100){
            clearInterval(timer);
            loader.classList.remove('show-f');
            loader.classList.add('hidden');
            trashIcon.classList.remove('hidden');
            trashIcon.classList.add('show-f');        
        }else{
            progress.style.width = width + '%';
            width++;
        }
    }, 10);
}