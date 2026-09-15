package com.idsanna.rag;

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;

/**
 * Optional assistive bridge. It is deliberately passive: it does not click,
 * type, navigate other apps, read window contents or execute background plans.
 * The user must enable/disable it manually in Android settings.
 */
public final class IdsannaAccessibilityService extends AccessibilityService {
    @Override public void onAccessibilityEvent(AccessibilityEvent event) {
        // Only acknowledge lifecycle events. No content is collected or sent.
    }

    @Override public void onInterrupt() {
        // No ongoing action exists to interrupt.
    }
}
