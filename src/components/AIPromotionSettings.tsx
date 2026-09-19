import React, { useState, useEffect } from 'react';
import { Bot, TestTube, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onModelChange?: (model: string) => void;
}

const AIPromotionSettings: React.FC<Props> = ({ onModelChange }) => {
  const [aiModel, setAiModel] = useState('inclusionai/ling-3.0-flash-vl:free');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved model from localStorage
    const savedModel = localStorage.getItem('ai_model');
    if (savedModel) {
      setAiModel(savedModel);
    }
  }, []);

  const handleTestModel = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/.netlify/functions/generate-promotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: 'Test Store',
          menuItems: [
            { name: 'Nasi Goreng', price: 20000, category: 'Makanan' }
          ],
          style: 'casual',
          testMode: true,
          customModel: aiModel
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: '✅ Model berhasil! Response: ' + data.message?.substring(0, 100) + '...'
        });
      } else {
        setTestResult({
          success: false,
          message: '❌ Model gagal: ' + (data.error || 'Unknown error')
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: '❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('ai_model', aiModel);
      
      if (onModelChange) {
        onModelChange(aiModel);
      }

      setTestResult({
        success: true,
        message: '✅ Model berhasil disimpan!'
      });

      setTimeout(() => {
        setTestResult(null);
      }, 3000);
    } catch (error) {
      setTestResult({
        success: false,
        message: '❌ Gagal menyimpan: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const popularModels = [
    { name: 'Ling 3.0 Flash VL', value: 'inclusionai/ling-3.0-flash-vl:free' },
    { name: 'Ling 3.0 Flash', value: 'inclusionai/ling-3.0-flash:free' },
    { name: 'Google Gemma 3 12B', value: 'google/gemma-3-12b-it:free' },
    { name: 'Qwen 3.8 27B', value: 'qwen/qwen3.8-27b:free' },
    { name: 'Mistral 7B', value: 'mistralai/mistral-7b-instruct:free' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
        <Bot size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-purple-900 mb-1">Pengaturan Model AI</p>
          <p className="text-purple-700 text-xs">
            Pilih model AI untuk generate pesan promosi. Anda bisa test model sebelum menyimpan.
          </p>
        </div>
      </div>

      {/* Model Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Model AI (OpenRouter)
        </label>
        <input
          type="text"
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
          placeholder="inclusionai/ling-3.0-flash-vl:free"
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Format: provider/model-name:version (contoh: inclusionai/ling-3.0-flash-vl:free)
        </p>
      </div>

      {/* Popular Models */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Model Populer
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularModels.map((model) => (
            <button
              key={model.value}
              onClick={() => setAiModel(model.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                aiModel === model.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-medium text-gray-800">{model.name}</p>
              <p className="text-xs text-gray-500 font-mono truncate">{model.value}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-xl border-2 ${
          testResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {testResult.success ? (
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleTestModel}
          disabled={isTesting || !aiModel}
          className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {isTesting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <TestTube size={18} />
              Test Model
            </>
          )}
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || !aiModel}
          className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Simpan Model
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-600">
          <strong>💡 Tips:</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Test model sebelum menyimpan untuk memastikan model bekerja</li>
          <li>Model dengan ":free" adalah model gratis dari OpenRouter</li>
          <li>Beberapa model mungkin memiliki rate limit</li>
          <li>Jika model error, coba model lain dari daftar populer</li>
          <li>Lihat daftar model lengkap di <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">openrouter.ai/models</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AIPromotionSettings;
