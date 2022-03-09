$(function(){
    // 抽取 dataAarry 
    var tmp_arr = []
    var rander_img_arr =[]
    for(let i= 0 ; tmp_arr.length < 8 ; i++){
        let rander_math = Math.floor((Math.random()*17)+1)
        if(!tmp_arr.includes(rander_math)){
            tmp_arr.push(rander_math)
            rander_img_arr.push(data[rander_math])
        }
    }

    // 讓圖片成對,不影響原始資料陣列
    var concat_arr = rander_img_arr.concat(rander_img_arr).sort(function (){
        return 0.5 - Math.random();
    })

    // render  Card
    var html_str =''
    for(let i = 0 ; i < concat_arr.length ; i++){
        html_str +=`<div class="card-container" data-id=${concat_arr[i].id}> 
                        <div class="cover">
                            cover
                        </div>
                        <div class="back">
                            <img src="${concat_arr[i].img}" alt="" style="border-radius: .4rem;">
                        </div>
                    </div>  
                    `
    }
    $('body').append(html_str);

    // 初始狀態
    var count = 0;
    var first_guess='';
    var second_guess='';
    var delay = 2000;

    // 音樂狀態
    var audio = $('#Match_fail')
    // console.log(audio[0].readyState);
    get_duration(audio);
    function get_duration(audio){
        var if_ready = audio[0].readyState == 4?true:false;
        if (if_ready){
            // return audio[0].duration
            console.log('別鬧',audio[0].duration);
        } else {
            setTimeout(function(){
                get_duration(audio)
            },0)

        }
    }

    var resetGuesses = function resetGuesses() {
        first_guess = "";
        second_guess = "";
        count = 0;
    
        var selected = $(".Selected").not('.match');
            selected.removeClass('Selected')
    };

    var match = function match() {
        var selected = $(".Selected");
        selected.addClass('match')
    };

    // 卡片配對驗證
    $('.card-container').click(function(event){
        console.log($(this).data('id'));//抓取 data-id

        if(count < 2){
            count++;
            if(count==1){
                if($(this).hasClass('Selected')){
                    alert('此牌卡已被翻開了');
                    count--;
                }else{
                    first_guess = $(this).data('id')
                }
            }
            else{
                if($(this).hasClass('Selected')){
                    alert('不可以重複點擊');
                    count--;
                }else{
                    second_guess = $(this).data('id')
                }
            }
            $(this).addClass('Selected')

            if( first_guess!='' && second_guess!=''){
                if(first_guess === second_guess){
                    console.log('成功');
                    var video_id = first_guess
                    console.log('要撥的影片',video_id);
                    setTimeout(match, delay)
                    call_video(video_id)
                }else{
                    console.log('失敗');
                    call_fail_audio()
                }
                setTimeout(resetGuesses, delay)
            }
        }
    })

    // modal 關閉時 ,影片暫停
    $('.close').click(function(){
        $('#video_block')[0].pause()
    })
})

function call_video(video_id){
    for(let i = 0 ; i < data.length ; i++){
        if(data[i].id == video_id){
            var video_str = data[i].video;
        }
    }
    var title_name = data[video_id].title

    $('#video_title').text(title_name);
    $('.modal-body').html(`<video class="video-fluid z-depth-1" controls="controls" autoplay="autoplay" muted="" id="video_block" style='width:100%' preload="auto">
                                <source src="${video_str}" type="video/mp4">
                            </video>
                            `
                        )
                            
    $('#show_video').modal('show');
    check_loading()
}

function check_loading(){
    if ( $('#video_block')[0].readyState === 4 ) {        
        setTimeout(function(){
            $('#video_block').prop('muted',false)
        },300);
    }
    else{
        setTimeout(check_loading ,100)
    }
}

function call_fail_audio(){
    $('.punch').removeClass('hide')
    var audio = $('#Match_fail')
    var duration =  audio[0].duration
    audio.prop('muted',false)
    audio[0].play();
    setTimeout(remove_punch,duration*1000)
}

function remove_punch(){
    $('.punch').addClass('hide')
}
