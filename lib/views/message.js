import view from './view';
import Api from '../api';
import config from '../config';

var message = {};


Object.assign(message, view, {
  template: '<div class="message">' +
              '<div class="heart-count">' +
                '<i class="mdi mdi-heart"></i>' +
                '<span data-hook="heart-value">3</span>' +
              '</div>' +
              '<div class="overlay">' +
                '<div class="icon-container">' +
                  '<i class="mdi mdi-heart"></i>' +
                  '<i class="mdi mdi-share"></i>' +
                '</div>' +
              '</div>' +
              '<video loop>' +
                '<source type="video/webm" src="" />' +
                '<source type="video/mp4" src="" />' +
              '</video>' +
              '<span class="text"></span>',

  initialize: function({videoUrl, text, likes, room, selfie,}){
    var split = videoUrl.split('/');
    this.id = split[split.length - 1].split('.')[0];

    this.room = room;

    if(!selfie){
      this.el.find('source[type="video/mp4"]').attr('src', config.mp4Source + this.id + '.mp4');
      this.el.find('source[type="video/webm"]').attr('src', config.webmSource + this.id + '.webm');
    } else {
      // this will be a data url
      this.el.find('source[type="video/mp4"]').attr('src', videoUrl);
      this.el.find('source[type="video/webm"]').attr('src', videoUrl);
    }

    this.el.find('span.text').text(text);

    this.el.find('.mdi-heart').click(this.handleHeartClick.bind(this));
    this.el.find('.mdi-share').click(this.handleShareClick.bind(this));

    if(!likes){
      this.el.find('.heart-count').hide();
    } else {
      this.el.find('[data-hook="heart-value"]').text(likes);
    }

    /**
      Removable messages?
    **/
    // if(false){
    //   var removeEl = document.createElement('span');
    //   removeEl.classList.add('remove-element');
    //   removeEl.textContent = 'x';
    //   container.appendChild(removeEl);
    // }
  },

  playVideo: function(){
    this.el.find('video').get(0).play();
  },

  handleHeartClick: function(e){
    var that = this;
    var heartCount = this.el.find('.heart-count');

    if(this._heartTimeout){
      clearTimeout(this._heartTimeout);
      this._heartTimeout = null;
      heartCount.removeClass('animate');
      setTimeout(function(){
        heartCount.addClass('animate');
      }, 10);
    } else {
      heartCount.addClass('animate');
    }

    this._heartTimeout = setTimeout(function(){
      heartCount.removeClass('animate');
      that._heartTimeout = null;
    }, 1000);


    Api.videoLiked(this.id, this.room);
  },

  handleShareClick: function(e){
    Api.shareMessage(this.id, this.room);
  },

  remove: function(){
    this.el.remove();
  },

  updateLikes: function(likes){
    this.el.find('.heart-count').show();
    this.el.find('[data-hook="heart-value"]').text(likes);
  },

  registerSelfie: function(videoUrl){
    var split = videoUrl.split('/');
    this.id = split[split.length - 1].split('.')[0];

    this.el.removeClass('selfie');

    this.selfie = false;
  }

});

export default message;