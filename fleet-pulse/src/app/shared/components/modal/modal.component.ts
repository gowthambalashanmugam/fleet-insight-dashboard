import {
  Component,
  input,
  output,
  HostListener,
  ElementRef,
  effect,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  private readonly elementRef = inject(ElementRef);
  private previouslyFocusedElement: HTMLElement | null = null;

  readonly isOpen = input.required<boolean>();
  readonly closeModal = output<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.onOpen();
      } else {
        this.onClose();
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (!this.isOpen()) return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1)!;

    if (keyEvent.shiftKey && document.activeElement === firstElement) {
      keyEvent.preventDefault();
      lastElement.focus();
    } else if (!keyEvent.shiftKey && document.activeElement === lastElement) {
      keyEvent.preventDefault();
      firstElement.focus();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal.emit();
    }
  }

  private onOpen(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    setTimeout(() => {
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    });
  }

  private onClose(): void {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const nativeEl: HTMLElement = this.elementRef.nativeElement;
    return Array.from(nativeEl.querySelectorAll<HTMLElement>(selector));
  }
}
