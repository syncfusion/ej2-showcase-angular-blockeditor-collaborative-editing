import { Injectable } from '@angular/core';
import { DEFAULT_EDITOR_BLOCKS } from '../utils/mock-data';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  /**
   * Get default editor blocks
   */
  getDefaultBlocks(): any[] {
    return JSON.parse(JSON.stringify(DEFAULT_EDITOR_BLOCKS));
  }

  /**
   * Get inline toolbar settings
   */
  getInlineToolbarSettings(): any {
    const customToolbarItems: string[] = [
      'Transform', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Uppercase', 
      'Lowercase', 'Subscript', 'Superscript', 'InlineCode', 'Link', 'Color', 'Backgroundcolor'
    ];
    
    return {
      items: customToolbarItems,
    };
  }

  /**
   * Get image block settings
   */
  getImageBlockSettings(): any {
    return {
      saveUrl: 'https://services.syncfusion.com/angular/production/api/RichTextEditor/SaveFile',
      path: 'https://services.syncfusion.com/angular/production/RichTextEditor/'
    };
  }
}
