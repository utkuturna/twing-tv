import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from './services/api.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SwiperDirective
} from 'ngx-swiper-wrapper';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor( private api: ApiService, private elem: ElementRef ) { }
  @ViewChild(SwiperDirective) slider: SwiperDirective;
  title: String = 'twing-tv';
  activeScreen: String = 'latest';
  videoData = [];
  loading: Boolean = true;
  selectedVideo: any;
  activeVideo: any;
  commentsActive: Boolean = false;
  config: SwiperConfigInterface = {
      loop: false,
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
      shadow: false,
      slideShadows: false,
      shadowOffset: 20,
      shadowScale: 0.94,
    }
   };
  ngOnInit() {
    this.getVideos(); // Get latest videos on first load
  }

  getVideos() { // Get videos of the current active screen
    this.loading = true;
    this.api.getVideos(this.activeScreen).subscribe( res => {
      this.videoData = res.data;
      this.loading = false;
    })
  }

  slideChange(e) { // Fires on slide change
    this.commentsActive = false;
    let allVideos = this.elem.nativeElement.querySelectorAll('.slide-video');
    allVideos.forEach(function(video){ // Select all videos and reset
      video.pause();
      video.removeEventListener('timeupdate', function(){ // Remove event listener on video time update
        video.currentTime = 0;
      });
      video.addEventListener('ended', function(){ // Remove event listener on video ended
        video.currentTime = 0;
      });
      video.load();
    });
    let i = e;
    let selectedVideo = this.elem.nativeElement.querySelectorAll('#video' + e);
    this.selectedVideo = selectedVideo[0];
    selectedVideo[0].play(); // Play video from current slide
    selectedVideo[0].addEventListener('timeupdate', (e) => this.updateProgress(selectedVideo[0], i)) // Listen video time change event to update progress bar
    selectedVideo[0].addEventListener('ended', (e) => this.videoEnded(selectedVideo[0])) // Listen video ended event to change slider
  }

  updateProgress(video, i) { // Update progress bar
    if(video.duration) {
      let videoPercent = ( video.currentTime / video.duration ) * 100;
      let progress = this.elem.nativeElement.querySelectorAll('#videoprogress' + i);
      if(progress[0]) {
        progress[0].style.width = videoPercent + '%';
        if(video.duration === video.currentTime) {
          progress[0].style.width = 0;
        }
      }
    }
  }

  videoEnded(video) { // Change on video ended
    this.slider.nextSlide();
  }

  sliderInit() { // Reset and init slider
    setTimeout(() => {
      this.slider.setIndex(0)
      this.slider.update();
      this.slideChange(0);
    }, 500)
  }

  likeAVideo(video) {
    if(!video.liked) { // Like
      video.liked = true;
      video.likeCount = video.likeCount + 1;
    } else { // Dislike
      video.liked = false;
      video.likeCount = video.likeCount - 1;
    }
  }

  openComments(video) { // Open Comments Area pause the video
    this.selectedVideo.pause();
    this.commentsActive = true;
  }

  closeComments() { // CLose Comments Area play the video
    this.selectedVideo.play();
    this.commentsActive = false;
  }
}
