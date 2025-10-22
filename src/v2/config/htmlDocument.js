import systemConfig from '@/v2/config/common';

(function (){
  const { title, description, keywords } = systemConfig;
  // 创建title标签
  const titleElement = document.createElement('title');
  titleElement.textContent = title;
  document.head.appendChild(titleElement);

  // 创建meta-description
  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = description;
  document.head.appendChild(metaDescription);

  // 创建meta-keywords
  const metaKeywords = document.createElement('meta');
  metaKeywords.name = 'keywords';
  metaKeywords.content = keywords;
  document.head.appendChild(metaKeywords);
})();