import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioService {
	private audio: HTMLAudioElement | null = null;

	init(filePath: string, loop: boolean = false): void {
		this.audio = new Audio(filePath);
		this.audio.loop = loop;
		this.audio.load();
	}

	play(): void {
		this.audio?.play();
	}

	stop(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}

	pause(): void {
		this.audio?.pause();
	}
}