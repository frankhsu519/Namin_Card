$(function(){
    // 抽取 dataAarry 
    var tmp_arr = []
    var rander_img_arr =[]
    for(let i= 0 ; tmp_arr.length < 8 ; i++){
        let rander_math = Math.floor((Math.random()*( data.length - 1 ))+1)
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
                            <img src="${concat_arr[i].img}" alt="" style="border-radius: .4rem; max-width:100%;">
                        </div>
                    </div>  
                    `
    }
    $('body').append(html_str);

    // 初始狀態
    var count = 0;
    var first_guess='';
    var second_guess='';
    window.delay = 2000;
    window.fail_dalay = 2000;

    window.resetGuesses = function resetGuesses(delay) {
        setTimeout(function(){
            first_guess = "";
            second_guess = "";
            count = 0;
        
            var selected = $(".Selected").not('.match');
            selected.removeClass('Selected')
        }, delay)
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
                    match();
                    call_video(video_id)

                    setTimeout(function(){
                        resetGuesses();
                    }, window.delay)

                }else{
                    console.log('失敗');

                    // 隨機fail_data
                    random_fail_audio()

                    //取得音樂資訊
                    var audio = $('#Match_fail');
                    get_duration(audio);
                }
            }
        }
    })

    // modal 關閉時 ,影片暫停
    $('.close').click(function(){
        //原始停止影片
        $('#video_block')[0].pause()
    })
})

// 呼叫成功影片
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

    //iframe 會遇到內嵌 block問題                    
    // $('.modal-body').html(
    //     `
    //     <iframe width="100%" height="450" src="${video_str}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen id='player_'></iframe>
    //     `
    // ) 

    $('#show_video').modal('show');

    // // modal 關閉時 ,iframe影片暫停
    // $('.close').click(function(){
    //     //ifram 停止
    //     $('#player').remove()
    // })


    check_loading()
}

// 確認成功影片loading
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
// 呼叫失敗影片& 顯示失敗圖片
function call_fail_audio(audio){
    $('.punch').removeClass('hide')
    var duration =  audio[0].duration
    audio.prop('muted',false)
    audio[0].play();
    setTimeout(remove_punch,duration*1000)
}

// 移除 失敗圖片
function remove_punch(){
    $('.punch').addClass('hide')
}

// 抓取失敗影片長度 
function get_duration(audio){
    var if_ready = audio[0].readyState == 4?true:false;
    if (if_ready){
        window.fail_dalay = audio[0].duration*1000;
        call_fail_audio(audio);
        setTimeout(function(){
            resetGuesses();
        }, window.fail_dalay)
    } else {
        setTimeout(function(){
            return get_duration(audio);
        },0)
    }
}

// 隨機 fail_data
function random_fail_audio(){
    
    var random_num = Math.floor((Math.random()*(fail_data.length)))
    var fail_audio = fail_data[random_num].audio
    var fail_img = fail_data[random_num].img
    var fail_audio_str = `
                        <audio id="Match_fail" preload="auto" autoplay="autoplay" muted="" playsinline>
                            <source src="${fail_audio}" type="audio/mp3" />
                        </audio>
                        <div class="punch hide">
                            <img src="${fail_img}" alt="">
                        </div>
                        `
    $(".match_fail_block").html(fail_audio_str);
}