# AAnimation.js

Simple native Javascript animations.

## Example Usage

Initialize with:

```
var anim = new AAnimation({
	start_value: 10,
	end_value: 100,
	timing: AAnimation.ease,
	onUpdate: function(new_value){
		someElem.style.top = new_value + "px";
	}
});
```

Start the animation:

```
anim.start();

```

## Options

_Required options are marked with *_

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>start_value</td>
			<td>number</td>
			<td>0</td>
			<td>The value to start the animation at. Ignored if start_values is set.</td>
		</tr>
		<tr>
			<td>start_values</td>
			<td>JSON</td>
			<td></td>
			<td>If you would like to animate several values, you can pass them here as a JSON object. Values to start the animation at.</td>
		</tr>
		<tr>
			<td>end_value</td>
			<td>number</td>
			<td>1</td>
			<td>The value to animate to. Ignored if start_values is set.</td>
		</tr>
		<tr>
			<td>end_values</td>
			<td>JSON</td>
			<td></td>
			<td>Required if start_values is set. Keys must match the keys set in start_values. Values to end the animation at.</td>
		</tr>
		<tr>
			<td>duration*</td>
			<td>number</td>
			<td></td>
			<td>The duration of the animation in milliseconds.</td>
		</tr>
		<tr>
			<td>timing*</td>
			<td>function</td>
			<td>AAnimation.linear</td>
			<td>The timing function to use for the animation.</td>
		</tr>
		<tr>
			<td>onStart</td>
			<td>function</td>
			<td></td>
			<td>Runs when start() is called.</td>
		</tr>
		<tr>
			<td>onUpdate*</td>
			<td>function</td>
			<td></td>
			<td>Runs each time the animation is updated. New value or JSON object of new values are passed as a parameter to onUpdate. Use this to update elements which are being animated.</td>
		</tr>
		<tr>
			<td>onFinish</td>
			<td>function</td>
			<td></td>
			<td>Runs once the animation has completed.</td>
		</tr>
	</tbody>
</table>


## Timing Functions

A timing function specifies the speed curve of the animation. AAnimation.js includes 4 built in timing functions: `AAnimation.ease`, `AAnimation.easein`, `AAnimation.easeout`, and `AAnimation.linear`.

A timing function takes in a time fraction. This is a value from 0 to 1 which measures the current time progress of the animation. It should return a value from 0 to 1 which determines the progress of the animation from start\_value(s) to end\_value(s).

### Example:

```
function quadraticEaseIn(time_fraction) {
	return Math.pow(time_fraction, 2);
}
```

## Animating Multiple Values

AAnimation.js can also animate on multiple values using the `start_values` and `end_values` parameters. These parameters accept JSON objects whose keysets must match. 

### Example:

To animate on two values called top and opacity which start at 100 and 0 and end at 200 and 1, respectively, `start_values` would look like this:

```
start_values: {
	top: 100,
	opacity: 0
}
```

...and `end_values` would look like this:

```
end_values: {
	top: 200,
	opacity: 1
}
```

onUpdate receives these values as a JSON object, and an example onUpdate for these values would look like this:

```
onUpdate: function(new_values) {
	someElem.style.top = new_values.top + "px";
	someElem.style.opacity = new_values.opacity;
}
```

## Another Example

A simple animation to scroll to the top of the window on a button press would look like this:

```
function scrollToTop(){
	var scrollAnim = new AAnimation({
	    timing: AAnimation.ease,
	    duration: 750,
	    start: window.scrollY,
	    end: 0,
	    onUpdate: function(new_value){
	        window.scrollTo(0,new_value);
	    }
	});
	scrollAnim();
}

someButton.addEventListener("click", function(){
	scrollToTop();
});


```

