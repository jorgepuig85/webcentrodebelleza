import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const updateMetaTag = (attr: string, key: string, value: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

const removeMetaTag = (attr: string, key: string) => {
    const element = document.querySelector(`meta[${attr}="${key}"]`);
    if(element) {
        element.remove();
    }
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}) => {
  useEffect(() => {
    const defaultTitle = 'Centro de Belleza - Depilación Definitiva';
    const defaultDescription = 'Centro de Belleza especializado en depilación láser definitiva en Santa Rosa y Miguel Riglos, La Pampa. Descubrí nuestros tratamientos y promociones.';
    const siteUrl = window.location.origin + window.location.pathname;
    
    // Update Title
    document.title = title ? `${title}` : defaultTitle;

    // Update Meta Description
    updateMetaTag('name', 'description', description || defaultDescription);

    // Update Meta Keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    } else {
        removeMetaTag('name', 'keywords');
    }

    // Update Open Graph Tags
    const finalOgTitle = ogTitle || title || defaultTitle;
    const finalOgDescription = ogDescription || description || defaultDescription;
    const finalOgUrl = ogUrl || siteUrl;

    updateMetaTag('property', 'og:title', finalOgTitle);
    updateMetaTag('property', 'og:description', finalOgDescription);
    updateMetaTag('property', 'og:url', finalOgUrl);
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', 'Centro de Belleza');

    // Update Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', finalOgTitle);
    updateMetaTag('name', 'twitter:description', finalOgDescription);
    if (ogImage) {
        updateMetaTag('name', 'twitter:image', ogImage);
    }

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl]);

  return null; // This component does not render anything
};

export default SEO;
