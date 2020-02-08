window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // Fallback - simulate 60fps
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} // Fallback

class AAnimation {
     constructor(params){

          // Timing function - Default to linear
          if(params.timing == null) {
               this.timing = AAnimation.linear;
          }
          else {
               this.timing = params.timing;
          }

          this.onUpdate = params.onUpdate;
          this.duration = params.duration;

          // Start value(s) - Default to 0
          if(params.start_value != null){
               this.is_single_val = true;
               this.start_value = params.start_value;
          }
          else if (params.start_values != null) {
               this.is_single_val = false;
               this.start_values = params.start_values;
          }
          else {
               this.is_single_val = true;
               this.start_value = 0;
          }

          // End value(s) - Default to 1
          // If multiple start values are being used, end values must match
          if(this.is_single_val){
               if(params.end_value != null){
                    this.end_value = params.end_value;
               }
               else {
                    this.end_value = 1;
               }
          }
          else {
               this.end_values = params.end_values;
          }

          // onFinish function
          if(params.onFinish != null) {
               this.onFinish = params.onFinish;
          }

          // onStart function
          if(params.onStart != null) {
               this.onStart = params.onStart;
          }
     }

     start(){
          if(!this._verify()){
               return;
          }

          if(this.onStart != null){
               this.onStart();
          }
          this.startstamp = window.performance.now();
          requestAnimationFrame((timestamp) => this._update(timestamp));
     }

     _verify(){
          var valid = true;

          // onUpdate function - REQUIRED
          if(this.onUpdate == null) {
               console.error("AAnimate: You must provide an onUpdate function.");
               valid = false;
          }

          // Duration - REQUIRED
          if(this.duration == null){
               console.error("AAnimate: You must provide an animation duration.");
               valid = false;
          }

          // Start and end values must match when animating on multiple values
          if(!this.is_single_val){
               if (this.end_values == null || !this._checkValueEquality(this.end_values, this.start_values)){
                    console.error("AAnimate: You must provide matching end values if you are using multiple start values.");
                    valid = false;
               }
          }

          return valid;
     }

     _update(timestamp){
          var timestamp = timestamp || window.performance.now();
          var runtime = timestamp - this.startstamp;

          var time_fraction = runtime / this.duration;
          time_fraction = Math.min(time_fraction, 1);
     
          // onUpdate
          if(this.is_single_val){
               let update_value = this.timing(time_fraction) * (this.end_value - this.start_value) + this.start_value;
               this.onUpdate(update_value);
          }
          else {
               let update_values = {};
               for(let key in this.start_values){
                    update_values[key] = this.timing(time_fraction) * (this.end_values[key] - this.start_values[key]) + this.start_values[key];
               }
               this.onUpdate(update_values);
          }
     
          // Animation is done
          if(time_fraction == 1) {
               
               // onFinish
               if(this.onFinish != null){
                    this.onFinish();
               }

               return;
          }
          
          requestAnimationFrame((timestamp) => this._update(timestamp));
     }

     static ease(time_fraction) {
          if(time_fraction < 0.5) {
               return Math.pow(time_fraction, 3) * 4;
          }
          else {
               time_fraction -= 1;
               return Math.pow(time_fraction, 3) * 4 + 1;
          }
     }

     static easein(time_fraction) {
          return Math.pow(time_fraction, 3);
     }
     
     static easeout(time_fraction) {
          return 1 - Math.pow(time_fraction, 3);
     }
     
     static linear(time_fraction) {
          return time_fraction;
     }

     _checkValueEquality(start_values, end_values){

          let start_keys = Object.keys(start_values);
          let end_keys = Object.keys(end_values);
          
          if(start_keys === end_keys){
               return true;
          }
          if (start_keys == null || end_keys == null){
               return false;
          }
          if (start_keys.length != end_keys.length){
               return false;
          }

          for(var pos = 0; pos < start_keys.length; pos++){
               if (start_keys[pos] != end_keys[pos]){
                    return false;
               }
          }

          return true;
     }
}