import '../styling/home.scss';
import SVG from '../components/svg';
import photo from '../photos/me.jpeg';
import Footer from './footer';
import bowelPetFood from '../photos/bowel-food.png';
import {addNewReview, convertImageToBase64String, getReviews, progressBar} from './local-storage';
import {useEffect, useState, useRef } from 'react';

export default function Home(){
    const maxScreenWidth = 905;
    const [activeReview, setActiveReveiw] = useState((window.screen.width <= maxScreenWidth)?[0]:[0, 1]);
    const [reviewsCount, setReviewsCount] = useState(getReviews().length);
    const [message, setMessage] = useState({status:false, type:null, count:0});
    const prevCount = useRef();  
    const [viewMode, setViewMode] = useState((window.screen.width <= maxScreenWidth)?'mobile':'desktop'); 
    
    useEffect(()=> {
        prevCount.current = message.count;
    }, [message.count])
    const modalToggle = ()=> {
        const modal = document.getElementById("modal-container");
        const body = document.getElementById("all-body-content-container");
        const navbar = document.getElementById("navbar-content-container");
        const footer = document.getElementById("footer-content-container");
        if(modal.className.includes('show-b')){
            modal.classList.remove('show-b');
            body.classList.remove('blur');
            navbar.classList.remove('blur');
            footer.classList.remove('blur');
            clearData();
        }else{modal.classList.add('show-b');
            body.classList.add('blur');
            navbar.classList.add('blur');
            footer.classList.add('blur');
        }
    }
    const handleForm = (event)=> {
        event.preventDefault();
        const surname = document.getElementById('surname-input');
        const about = document.getElementById('about-input');
        const image = document.getElementById('photo-input');
        const imageValidation = ()=> {
            if(image.files.length === 1 ){
                const imagesTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                const [img] = event.target.input[1].files;
                if(img.size <= 2000000 && imagesTypes.includes(img.type)){return true;}
                return false;
            }
            return true;
        }
        if(surname.value.trim().length > 0 && about.value.trim().length > 0 && imageValidation() ){
            const result = addNewReview({surname:surname.value.trim(), about:about.value.trim()});
            modalToggle();
            if(result){
                setMessage((existingValues) => ({status:true, type:'success', count:existingValues.count+1 }));
                setReviewsCount(getReviews().length);
            }else{
                setMessage((existingValues) => ({status:false, type:'error', count:existingValues.count+1 }));
            }
        }else {
            surname.value = surname.value.trim();
            about.value = about.value.trim();
        }
    }
    const fireFileInput = ()=> {
        const surname = document.getElementById('surname-input');
        if(surname.value.trim().length > 0){
            document.getElementById('photo-input').click();
        }
    }
    const clearData = ()=> {
        const fileInfoContainer  = document.getElementById('file-info-container');
        const imageUploadButton  = document.getElementById('image-upload-button');
        fileInfoContainer.classList.add("hidden");
        fileInfoContainer.classList.remove("show-i-b");
        document.getElementById('surname-input').value = '';
        document.getElementById('about-input').value = '';
        deleteFile();
        localStorage.removeItem('image');
        document.getElementById('textarea-text-size-limit').innerText = '0/200';
        imageUploadButton.classList.add('disabled');
    }
    const handleSurnameInput = ()=> {
        const surname = document.getElementById('surname-input');
        const button = document.getElementById('image-upload-button');
        if(surname.value.length > 30){
            surname.value = surname.value.slice(0, 29);
        }
        if(surname.value.trim().length > 0){
            button.classList.remove('disabled');
        }else {
            button.classList.add('disabled');
        }
    }
    const updateFileInfo = (event)=>{
        const fileInfoContainer  = document.getElementById('file-info-container');
        const fileNameContainer  = document.getElementById('file-name-container');
        const imageReview  = document.querySelector('.image-review-container img');
        const loader = document.getElementById('progress-bar');
        const [file] = event.target.files;
        if(file.name.length > 0){
            fileInfoContainer.classList.remove("hidden");
            fileInfoContainer.classList.add("show-i-f");
            imageReview.src = document.getElementById('photo-input').value;
        }else {
            fileInfoContainer.classList.add("hidden");
            fileInfoContainer.classList.remove("show-i-f");
        }
        if(file.size > 2000000){
            loader.classList.add('loading-error');
            loader.classList.remove('loading');
            fileNameContainer.innerText = 'Your file is too big!';  
            progressBar();
        }else{
            fileNameContainer.innerText = file.name;
            convertImageToBase64String(file);
            loader.classList.remove('loading-error');
            loader.classList.add('loading');
        }
    }
    const deleteFile = ()=> {
        document.getElementById('file-name-container').innerText = '';
        const photo = document.getElementById('photo-input');
        const fileInfoContainer  = document.getElementById('file-info-container');
        fileInfoContainer.classList.remove("show-i-f");
        fileInfoContainer.classList.add("hidden");
        photo.type = 'text';
        photo.type = 'file';
        localStorage.removeItem('image');
        document.querySelector('.image-review-container img').removeAttribute('src');
    }
    const handleTextArea = (event)=> {
        const text = event.target.value;
        const lengthContainer = document.getElementById('textarea-text-size-limit');
        if(text.length >= 200){
            const textarea = document.querySelector('#about-input');
            textarea.value = text.slice(0, 199);
            lengthContainer.innerText = '200/200';
        }else {
            lengthContainer.innerText = text.length + '/200';
        }
    }
    const slidersChange = (direction)=> {
        const reviewsCount = document.querySelectorAll('#reviews-container .review').length;
        const [firstActive, secondActive] = activeReview;
        const screenWidth = window.screen.width;
        if(screenWidth <= maxScreenWidth){
            if(direction === '+'){
                if(firstActive >= reviewsCount){setActiveReveiw([0]);}
                else{setActiveReveiw([firstActive + 1]);}
            }else {
                if(firstActive - 1 < 0){setActiveReveiw([reviewsCount - 1])}
                else{setActiveReveiw([firstActive - 1]);}
            }
        }else {
                if(direction === '+'){
                    if(firstActive+2 >= reviewsCount){
                        setActiveReveiw([0, 1]);
                    }else {
                        setActiveReveiw([firstActive+2, secondActive+2]);
                    }
                }else {
                    setActiveReveiw([firstActive - 2, secondActive -2]);
                    if(firstActive - 2 < 0 && reviewsCount >= 2){
                        if(reviewsCount%2 === 0){
                            setActiveReveiw([reviewsCount-2, reviewsCount - 1]);
                        }else {
                            setActiveReveiw([reviewsCount-1, reviewsCount]);
                        }
                    }
                    else if(firstActive - 2 < 0 && reviewsCount < 2){
                        setActiveReveiw([0, 1]);
                    }
                }
        }
    }
    window.addEventListener('load', ()=> {  
        window.addEventListener('resize', ()=> {  
            if(window.screen.width <= maxScreenWidth && viewMode === 'desktop'){setViewMode('mobile');setActiveReveiw([0]);}
            else if(window.screen.width > maxScreenWidth && viewMode === 'mobile'){setViewMode('desktop');setActiveReveiw([0,1]);}
        });
    })
    return (<div className="content-container" >
        <div className='all-body-content-container' id='all-body-content-container'>
            <div className='content-1'>
                <div id='subcontainer'>
                    <div className='row-1'>
                        <div id='main-text'>
                                Добро пожаловать в академию!
                        </div>
                    </div>
                    <div className='row-2'>
                        <div className='photo-container'>
                            <img src={photo} id='photo-profile' alt=''/>
                        </div>
                        <div className='about-me-container'>
                            <div className='text'>
                                <div className='name'>Мохаммед</div>
                                    <div className='info'>
                                        <div>
                                            <strong>Город: </strong>
                                            <span>Томск</span>
                                        </div>
                                        <div>
                                            <strong>Пол: </strong>
                                            <span>мужчина</span>
                                            <span> {<SVG name='mars' color='#585CC6' />}</span>
                                        </div>
                                        <div>
                                            <strong>Возраст: </strong>
                                            <span>30</span>
                                        </div>
                                </div>
                                <div className='about-me'>
                                    О себе: Всем привет! Меня зовут Мохаммед, мне 30 лет, я студент.
                                   
                                    Учусь на программиста, так как люблю создавать сайты и писать код. Я постоянно узнаю что-то новое и создаю приложения, так как хочу получить работу в этой области и писать код каждый день.
                                    Я знаю JavaScript для фронтенда и Python для бэкенда. Я говорю на английском и на русском. 
                                </div>
                                <div className='pet'><img src={bowelPetFood} id='bowel-pet-food' alt=''/><strong>Домашнее животное: </strong> нету</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='content-2'>
                <div className='reviews-container'>
                    <div className='row-1'>
                        <div id='title-container'>
                            <span>Отзывы</span>
                        </div>
                        <div id='button-container' >
                            <button onClick={()=> modalToggle()} >
                                <div className='svg-container'>
                                <SVG name='plus' color='white' />
                                </div>
                                <div className='text-container'>
                                    <span>Добавить отзыв</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className='row-2' id='reviews-container'>
                        {getReviews().map((item, index) => {return (<div className={(activeReview.includes(index) && window.screen.width > maxScreenWidth)?((index%2!==0)?'review review-mobile':'review'):((activeReview.includes(index))?'review':'review hidden')} key={index}>
                            <div className='row-1'>
                                <div className='left'>
                                    <div className='photo-container'>
                                        {(item.photo)?<img src={item.photo} alt='' />:<SVG name='camera' color='silver' />}
                                    </div>
                                    <div className='surname' ><strong>{item.surname} </strong></div>
                                </div>
                                <div className='right'>{item.date}</div>
                            </div>
                            <div className='about' >{item.about}</div>
                        </div>)})}
                    </div>
                    <div className='row-3'>
                        {(getReviews()).map((item, index)=> {return (
                        <span key={index} 
                        className={(window.screen.width <= maxScreenWidth)?
                                ((activeReview.includes(index))?'line show-i-b active':(((index+1)%2 === 0)?'line show-i-b':'line line-mobile')):
                                ((activeReview.includes(index) && index%2 === 0)?'line show-i-b active':
                                                                                                    (((index+1)%2 === 0)?'mobile-line':'line show-i-b'))
                            }>
                        </span>)
                        })}
                    </div>
                </div>
                <div className='sliders-container'>
                    <button onClick={()=> {if(!activeReview.includes(0 || 1) && window.screen.width > maxScreenWidth){slidersChange('-')}else{if(!activeReview.includes(0))slidersChange('-')}}} className={(window.screen.width <= maxScreenWidth)?((activeReview.includes(0))?'inactive':'active'):((activeReview.includes(0 || 1) || reviewsCount <= 2)?'inactive':'active')}>
                        <SVG name='arrow-left' color={(activeReview.includes(0) || reviewsCount <= 2)?'#8A8A8A':'black'} />
                    </button>
                    <button onClick={()=> {if(!activeReview.includes(reviewsCount-1))slidersChange('+')}} className={(activeReview.includes(reviewsCount-1 || reviewsCount - 2) || reviewsCount <= 2)?'inactive':'active'}>
                        <SVG name='arrow-right' color={(activeReview.includes(reviewsCount - 1) || reviewsCount <= 2)?'#8A8A8A':'black'} />
                    </button>
                </div>
            </div>
        </div>
        <div className='modal-container' id='modal-container'>
                <div className='content-container'>
                    <div className='header-container'>
                        <div className='title'>Отзыв</div>
                        <div onClick={()=> {modalToggle()}}>
                            <span className='close'  title='Закрыть окно'>&times;</span>
                        </div>
                    </div>
                    <div className='body-container'>
                        <form method='POST' onSubmit={(event)=> handleForm(event)}>
                            <div className='row-1'>
                                    <label htmlFor='surname-input'>Как вас зовут?</label>
                                    <div>
                                    <input required onInput={()=> handleSurnameInput()} type='text' name='input' id='surname-input' maxLength='30' placeholder='Имя Фамилия' />
                                    <input onChange={(event)=> updateFileInfo(event)} style={{display:'none'}} type='file' name='input' id='photo-input' accept='image/*'/>
                                    <button type='button' id='image-upload-button' onClick={()=> fireFileInput()} className='disabled'>
                                        <SVG name='plus' color='white' />
                                        <span className='text-span'>Загрузить фото</span>
                                    </button>
                                    </div>
                            </div>
                            <div className='row-2'>
                                <div className='file-info-container hidden' id='file-info-container'>
                                    <div className='image-review-container'>
                                        <img src={localStorage.getItem('image')} alt='' />
                                    </div>
                                    <div>
                                        <div id='file-name-container'></div>
                                        <div className='progress-bar-container'>
                                            <div className='progress-bar' id='progress-bar'></div>
                                        </div>
                                    </div>
                                    <div id='file-delete-container' onClick={()=> deleteFile()}>
                                        <SVG name='trash' color='red' />
                                    </div>
                                    <div className='loader-container hidden' id='loader-container'>
                                        <div className='loader' id='loader'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='row-3'>
                                <label htmlFor='about-input' >Все ли вам понравилось?</label>
                                <textarea name='input' required id='about-input' onInput={(e)=> handleTextArea(e)} placeholder='Напишите пару слов о вашем опыте...' />
                                <div className='text-limit-container'>
                                    <div id='textarea-text-size-limit'>0/200</div>
                                </div>
                            </div>
                            <div className='row-4'>
                                <div>
                                    <div className='svg-container'>
                                        <SVG name='exclamation' color='#585CC6' />
                                    </div>
                                    <span className='text-container'>Все отзывы проходят модерацию в течение 2 часов</span>
                                </div>
                                <button type='submit'><span>Отправить отзыв</span></button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
        <Footer messages={message} prevMessagesCount={prevCount} />
    </div>)
}