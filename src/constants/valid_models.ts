/**
 * List of Valid Models that can be used
**/
export const VALID_MODELS = [
    {
      model: 'gpt-4o',
      name: 'openai_4o',
      display: 'GPT-4o (soon)',
    },
    {
      model: 'gemini-2.0-flash', 
      name: 'gemini_flash',
      display: 'Gemini 2.0 Flash',
    },
    {
      model: 'claude 3.7',
      name: 'claude_3.7_sonnet',
      display: 'Claude 3.7'
    }
  ]
  
  /**
   * Type of valid models that can be used in the application.
   */
  export type ValidModel = 'openai_4o'| 'gemini_flash' | 'claude_3.7_sonnet';