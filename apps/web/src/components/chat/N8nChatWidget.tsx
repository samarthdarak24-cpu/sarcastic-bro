'use client';

import { useEffect } from 'react';

interface N8nChatWidgetProps {
  label?: string;
  description?: string;
  hostname: string;
  openOnStart?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  surfaceColor?: string;
  borderColor?: string;
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
}

export function N8nChatWidget({
  label = 'AI Assistant',
  description = '',
  hostname,
  openOnStart = false,
  primaryColor,
  secondaryColor,
  backgroundColor,
  textColor,
  accentColor,
  surfaceColor,
  borderColor,
  successColor,
  warningColor,
  errorColor,
}: N8nChatWidgetProps) {
  useEffect(() => {
    // Load the n8n chat script from public directory
    const script = document.createElement('script');
    script.src = '/n8n-chat/index.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Build attributes object
  const attributes: Record<string, string> = {
    label,
    hostname,
    'open-on-start': openOnStart ? 'true' : 'false',
  };

  if (description) attributes.description = description;
  if (primaryColor) attributes['primary-color'] = primaryColor;
  if (secondaryColor) attributes['secondary-color'] = secondaryColor;
  if (backgroundColor) attributes['background-color'] = backgroundColor;
  if (textColor) attributes['text-color'] = textColor;
  if (accentColor) attributes['accent-color'] = accentColor;
  if (surfaceColor) attributes['surface-color'] = surfaceColor;
  if (borderColor) attributes['border-color'] = borderColor;
  if (successColor) attributes['success-color'] = successColor;
  if (warningColor) attributes['warning-color'] = warningColor;
  if (errorColor) attributes['error-color'] = errorColor;

  // Create the element string with all attributes
  const elementString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<n8n-embedded-chat-interface ${elementString}></n8n-embedded-chat-interface>`,
      }}
    />
  );
}
