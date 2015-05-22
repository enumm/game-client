//# sourceURL=buttonHelper.js
(function() {

function ButtonHelper(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }
		this.target = target;
		this.overLabel = overLabel == null ? "over" : overLabel;
		this.outLabel = outLabel == null ? "out" : outLabel;
		this.downLabel = downLabel == null ? "down" : downLabel;
		this.play = play;
		this._isPressed = false;
		this._isOver = false;
		this._enabled = false;
		target.mouseChildren = false; // prevents issues when children are removed from the display list when state changes.
		this.enabled = true;
		this.handleEvent({});
		if (hitArea) {
			if (hitLabel) {
				hitArea.actionsEnabled = false;
				hitArea.gotoAndStop&&hitArea.gotoAndStop(hitLabel);
			}
			target.hitArea = hitArea;
		}

		this.setEnabled(true);
	}
	var b = createjs.extend(ButtonHelper, createjs.Container);
	b.isPressed = function(val){
		this._isPressed = val;
	}

	b.setEnabled = function(value) { // TODO: deprecated.
		if (value == this._enabled) { return; }
		var o = this.target;
		this._enabled = value;
		if (value) {
			o.cursor = "pointer";
			o.addEventListener("rollover", this);
			o.addEventListener("rollout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("pressup", this);
		} else {
			o.cursor = null;
			o.removeEventListener("rollover", this);
			o.removeEventListener("rollout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("pressup", this);
		}
	};
	b.getEnabled = function() {
		return this._enabled;
	};
 
	try {
		Object.defineProperties(p, {
			enabled: { get: p.getEnabled, set: p.setEnabled }
		});
	} catch (e) {} // TODO: use Log

	b.toString = function() {
		return "[ButtonHelper]";
	};
	b.handleEvent = function(evt) {
		var label, t = this.target, type = evt.type;
		if (type == "mousedown") {
			this._isPressed = true;
			label = this.downLabel;
		} else if (type == "pressup") {
			this._isPressed = true;
		} else if (type == "rollover") {
			this._isOver = true;
			label = this.overLabel;
		} else { // rollout and default
			label = this._isPressed ? this.downLabel : this.outLabel;
		}
		if (this.play) {
			t.gotoAndPlay&&t.gotoAndPlay(label);
		} else {
			t.gotoAndStop(label);
		}
	};

	window.ButtonHelper = createjs.promote(ButtonHelper, "Container");
}());