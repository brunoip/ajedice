import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioService {

	private audio: HTMLAudioElement | null = null;

	init(src: string, loop = false) {
		if (this.audio) return; // Already initialized — don't reset it
		this.audio = new Audio(src);
		this.audio.loop = loop;
		this.audio.play();
	}

	play() {
		this.audio?.play();
	}

	pause() {
		this.audio?.pause();
	}

	isPlaying(): boolean {
		return !!this.audio && !this.audio.paused;
	}

	stop(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}

	isInitialized(): boolean {
		return this.audio !== null;
	}

}