'use strict';

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // Fallback to setTimeout - simulate 60fps
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} // Fallback to setTimeout

class AAnimation {
     constructor(params){

          // Timing function - Default to linear
          if(typeof params.timing !== 'undefined') {
               this.timing = params.timing;
          }
          else {
               this.timing = AAnimation.linear;
          }

          // onUpdate function - REQUIRED
          this.onUpdate = params.onUpdate;

          // Animation duration - REQUIRED
          this.duration = params.duration;

          // start_value - Default to 0.
          // If start_values is set, overrides any start_value that is set.
          if(typeof params.start_value !== 'undefined'){
               this.is_single_val = true;
               this.start_value = params.start_value;
          }
          else if (typeof params.start_values !== 'undefined') {
               this.is_single_val = false;
               this.start_values = params.start_values;
          }
          else {
               this.is_single_val = true;
               this.start_value = 0;
          }

          // end_value - Default to 1
          // If start_values is set, end_value is ignored and only end_values are used.
          if(this.is_single_val){
               if(typeof params.end_value !== 'undefined'){
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
          if(typeof params.onFinish !== 'undefined') {
               this.onFinish = params.onFinish;
          }

          // onStart function
          if(typeof params.onStart !== 'undefined') {
               this.onStart = params.onStart;
          }
     }

     /**
      * Starts the animation. First checks if required parameters have been set.
      */
     start(){

          // If verification fails, return
          if(!this._verify()){
               return;
          }

          // If an onStart function has been defined, call it before starting the animation
          if(typeof this.onStart !== 'undefined'){
               this.onStart();
          }

          // Set the starting timestamp and start the animation
          this.startstamp = window.performance.now();
          requestAnimationFrame((timestamp) => this._update(timestamp));
     }

     /**
      * Verifies that all required parameters have been set and have valid values.
      * @returns true if all parameters have been set and are valid, false otherwise.
      */
     _verify(){
          var valid = true;

          // onUpdate function - REQUIRED
          if(typeof this.onUpdate === 'undefined') {
               console.error('AAnimate: You must provide an onUpdate function.');
               valid = false;
          }

          // Duration - REQUIRED
          if(typeof this.duration === 'undefined'){
               console.error('AAnimate: You must provide an animation duration.');
               valid = false;
          }

          // Start and end values must match when animating on multiple values
          if(!this.is_single_val){
               if (typeof this.end_values === 'undefined' || !this._checkKeyEquality(this.end_values, this.start_values)){
                    console.error('AAnimate: You must provide matching end values if you are using multiple start values.');
                    valid = false;
               }
          }

          return valid;
     }

     /**
      * Advances a frame in the animation. Calls itself until the animation has completed.
      * @param {Number} timestamp the timestamp of the frame.
      */
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
               if(typeof this.onFinish !== 'undefined'){
                    this.onFinish();
               }

               return;
          }
          
          // Queue up the next animation frame
          requestAnimationFrame((timestamp) => this._update(timestamp));
     }

     /**
      * Quartic ease in-out timing function
      * @param {Number} time_fraction a number from 0 - 1. How far the animation has progressed in time.
      */
     static ease(time_fraction) {
          if(time_fraction < 0.5) {
               return Math.pow(time_fraction, 3) * 4;
          }
          else {
               time_fraction -= 1;
               return Math.pow(time_fraction, 3) * 4 + 1;
          }
     }

     /**
      * Quartic ease in timing function
      * @param {Number} time_fraction a number from 0 - 1. How far the animation has progressed in time.
      */
     static easein(time_fraction) {
          return Math.pow(time_fraction, 3);
     }
     
     /**
      * Quartic ease out timing function
      * @param {Number} time_fraction a number from 0 - 1. How far the animation has progressed in time.
      */
     static easeout(time_fraction) {
          return 1 - Math.pow(time_fraction, 3);
     }
     
     /**
      * Linear timing function
      * @param {Number} time_fraction a number from 0 - 1. How far the animation has progressed in time.
      */
     static linear(time_fraction) {
          return time_fraction;
     }

     /**
      * Checks if the key sets for two JSON objects match.
      * @param {Object} obj1 The first object to compare.
      * @param {Object} obj2 The second object to compare.
      * @returns true if the objects have the same key sets, false otherwise.
      */
     _checkKeyEquality(obj1, obj2){

          let start_keys = Object.keys(obj1);
          let end_keys = Object.keys(obj2);
          
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