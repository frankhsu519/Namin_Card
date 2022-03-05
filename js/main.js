$(function(){

    // 隨機抽取圖片數字
        var tmp_arr = []
        var rander_img_arr =[]
        for(let i= 0 ; tmp_arr.length < 8 ; i++){
            let rander_math = Math.floor((Math.random()*12)+1)
            if(!tmp_arr.includes(rander_math)){
                tmp_arr.push(rander_math)
                rander_img_arr.push(
                    {   
                        name:`namin-0${rander_math}`,
                        img:`../data_img/${rander_math}.png`,                  
                    }
                )
            }
        }

    // 讓圖片成對,不影響原始資料陣列
    var concat_arr = rander_img_arr.concat(rander_img_arr).sort(function (){
        return 0.5 - Math.random();
    })

    // render  Card
    var html_str =''
    for(let i = 0 ; i < concat_arr.length ; i++){
        html_str +=`<div class="card-container" data-name=${concat_arr[i].name}> 
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
    var delay = 1000;

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
        // console.log($(this));
        console.log($(this).data('name'));//抓取 data-name
        // var cover = $(this.children[0]);
        // var back = $(this.children[1]);  

        if(count < 2){
            count++;
            if(count==1){
                if($(this).hasClass('Selected')){
                    alert('此牌卡已被翻開了');
                    count--;
                }else{
                    first_guess = $(this).data('name')
                }
            }
            else{
                if($(this).hasClass('Selected')){
                    alert('不可以重複點擊');
                    count--;
                }else{
                    second_guess = $(this).data('name')
                }
            }
            $(this).addClass('Selected')

            if( first_guess!='' && second_guess!=''){
                if(first_guess === second_guess){
                    console.log('成功');
                    var video_name = first_guess.split('-')[1]
                    console.log('要撥的影片',video_name);
                    setTimeout(match, delay)
                    call_video(video_name)
                }else{
                    console.log('失敗');
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

function call_video(video_name){
    var video_str=`${window.location.origin}/video/${video_name}.mp4`;
    console.log(video_str);

    var title_name = change_titleName(video_name)

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

function change_titleName (video_name) {
    switch (video_name){
        case '01':
            return "168 !! i'm 168 ";
            break;
        case '02':
            return "啾 啾 啾 ";
            break;
        case '03':
            return "Kisses ";
            break;
        case '04':
            return "Kiyomi ";
            break;
        case '05':
            return "Sakura ";
            break;                
        case '06':
            return "Thank you Donate ";
            break; 
        case '07':
            return "我不知道歌名";
            break; 
        case '08':
            return "gugugaga ";
            break; 
        case '09':
            return "Namin Kitty ";
            break; 
        case '010':
            return "Nico Nico ";
            break; 
        case '011':
            return "Ottok ";
            break;         
        case '012':
            return "Yum Yum Song ";
            break;
        default:
        return "哈囉 ";
    }
}
