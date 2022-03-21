import '../styling/footer.scss';
import SVG from './svg';
import { useEffect } from 'react';

export default function Footer(props){
   useEffect(()=> {
    if(props.messages.count > props.prevMessagesCount.current){
        messagesToggle(props.messages.type);
        setTimeout(()=> {
         if(document.location.pathname === '/'){messagesToggle(props.messages.type, 'hide');}
        }, 10000); 
      }
}, [props.messages.count, props.messages.type, props.prevMessagesCount]); 
    const messagesToggle = (messageType, hide=null)=> {
      if(hide){
        const successMessage = document.getElementById('message-success-container');
        const errorMessage = document.getElementById('message-error-container');
        errorMessage.classList.remove('show-f');
        successMessage.classList.remove('show-f');
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
      }else{
        const messageContainer = document.getElementById('message-'+ messageType + '-container');
        if(messageContainer.className.includes('hidden')){
          messageContainer.classList.remove('hidden');
          messageContainer.classList.add('show-f');
        }else{
          messageContainer.classList.add('hidden');
          messageContainer.classList.remove('show-f');
        }
      }
    }
    return (<div className="footer-container" id='footer-content-container'>
          <div className='footer-section'>

            <div className='text-container'>
                  © iLINK ACADEMY. ALL RIGHTS RESERVED. 2022
            </div>
            <div className='icons-container'>
                <div className='vk'>
                  <a href='https://vk.com/ilinkdev' target='_blank' rel="noreferrer">
                      <SVG name='vk' color='#585CC6' />
                    </a> 
                  </div>
              <SVG name='reddit' color='#585CC6' />
              <a href='https://t.me/ilink_manager_1' target="_blank" rel="noreferrer">
              <SVG name='telegram' color='#585CC6' />
              </a>
            </div>
          </div>
        <div className='flash-messages-container'>
          <div className='message-success-container hidden' id='message-success-container'>
            <div className='column-2'>
                <div className='circle-1'></div>
                <div className='circle-2'></div>
                <div className='circle-3'></div>
            </div>
            <div className='column-1'>
              <div className='row-1'>
                <div className='svg-container'> 
                  <SVG name='circle-check' color='#7DED61' />
                  <span className='svg-background-color'></span>
                </div>
                <div className='vector'></div> 
              </div>
              <div className='row-2'>
                  <span className='header'>Успешно!</span>
                  <span className='close' onClick={()=> messagesToggle('success')} title='Закрыть окно'>&times;</span>
              </div>
              <div className='row-3'>
                <div className='text'>Спасибо за отзыв о нашей компании :)</div>
              </div>
            </div>
          </div>
          <div className='message-error-container hidden' id='message-error-container'>
            <div className='column-2'>
                <div className='circle-1'></div>
                <div className='circle-2'></div>
                <div className='circle-3'></div>
            </div>
            <div className='column-1'>
              <div className='row-1'>
                <div className='svg-container'>
                  <SVG name='circle-xmark' color='#C81912' />
                  <span className='svg-background-color'></span>
                </div>
                <div className='vector'></div>
              </div>
              <div className='row-2'>
                  <span className='header'>Что-то не так...</span>
                  <span className='close' onClick={()=> messagesToggle('error')} title='Закрыть окно'>&times;</span>
              </div>
              <div className='row-3'>
                <div className='text'>Не получилось отправить отзыв. Попробуйте еще раз!</div>
              </div>
            </div>
          
          </div>
        </div>
    </div>)
}