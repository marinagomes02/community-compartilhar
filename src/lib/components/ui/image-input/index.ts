import type { HTMLInputAttributes } from 'svelte/elements';
import Root from './tag-input.svelte';

export {
	Root,
	//
	Root as TagInput,
};

export type TagInputProps = HTMLInputAttributes & {
	value?: string[];
	maxTags?: number;
	placeholder?: string;
	placeholderWhenFull?: string;
	minLength?: number;
	maxLength?: number;
};

type FormInputEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLInputElement;
};
export type TagInputEvents = {
	blur: FormInputEvent<FocusEvent>;
	change: FormInputEvent<Event>;
	click: FormInputEvent<MouseEvent>;
	focus: FormInputEvent<FocusEvent>;
	keydown: FormInputEvent<KeyboardEvent>;
	keypress: FormInputEvent<KeyboardEvent>;
	keyup: FormInputEvent<KeyboardEvent>;
	mouseover: FormInputEvent<MouseEvent>;
	mouseenter: FormInputEvent<MouseEvent>;
	mouseleave: FormInputEvent<MouseEvent>;
	paste: FormInputEvent<ClipboardEvent>;
	input: FormInputEvent<InputEvent>;
};
