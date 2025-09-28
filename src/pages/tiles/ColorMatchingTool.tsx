/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { InputField } from '$app/components/forms/InputField';
import { SelectField } from '$app/components/forms/SelectField';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface ColorMatch {
  product_id: string;
  product_key: string;
  tile_color: string;
  brand: string;
  collection: string;
  tile_type: string;
  tile_size: string;
  hex_color: string;
  rgb_values: {
    r: number;
    g: number;
    b: number;
  };
  color_difference: number;
  similarity_percentage: number;
  price: number;
  available_quantity: number;
}

interface ExtractedColor {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  name: string;
  percentage: number;
}

interface ColorAnalysis {
  dominant_colors: ExtractedColor[];
  suggested_matches: ColorMatch[];
  analysis: {
    primary_color_family: string;
    secondary_colors: string[];
    brightness_level: string;
    saturation_level: string;
    temperature: string;
  };
}

export default function ColorMatchingTool() {
  const [t] = useTranslation();
  const colors = useColorScheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<ExtractedColor | null>(
    null
  );
  const [analysisMethod, setAnalysisMethod] = useState<'auto' | 'manual'>(
    'auto'
  );
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [filters, setFilters] = useState({
    max_price: '',
    min_quantity: '',
    tile_type: '',
    brand: '',
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setColorAnalysis(null);
      setSelectedColor(null);
      setClickPosition(null);
    };
    reader.readAsDataURL(file);
  };

  const extractColorFromImage = useCallback(
    (imageData: string, x?: number, y?: number) => {
      return new Promise<ExtractedColor[]>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return resolve([]);

          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve([]);

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          let colors: ExtractedColor[] = [];

          if (x !== undefined && y !== undefined) {
            // Extract color from specific point
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

            colors = [
              {
                hex,
                rgb,
                name: getColorName(rgb),
                percentage: 100,
              },
            ];
          } else {
            // Extract dominant colors from entire image
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            colors = extractDominantColors(imageData);
          }

          resolve(colors);
        };
        img.src = imageData;
      });
    },
    []
  );

  const extractDominantColors = (imageData: ImageData): ExtractedColor[] => {
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    const step = 10; // Sample every 10th pixel for performance

    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha < 128) continue; // Skip transparent pixels

      // Quantize colors to reduce noise
      const quantizedR = Math.round(r / 32) * 32;
      const quantizedG = Math.round(g / 32) * 32;
      const quantizedB = Math.round(b / 32) * 32;

      const key = `${quantizedR},${quantizedG},${quantizedB}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Sort by frequency and take top 5
    const sortedColors = Array.from(colorMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const totalPixels = sortedColors.reduce((sum, [, count]) => sum + count, 0);

    return sortedColors.map(([rgbString, count]) => {
      const [r, g, b] = rgbString.split(',').map(Number);
      const rgb = { r, g, b };
      const hex = rgbToHex(r, g, b);
      const percentage = Math.round((count / totalPixels) * 100);

      return {
        hex,
        rgb,
        name: getColorName(rgb),
        percentage,
      };
    });
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const getColorName = (rgb: { r: number; g: number; b: number }): string => {
    const { r, g, b } = rgb;

    // Simple color naming logic
    if (r > 200 && g > 200 && b > 200) return 'White';
    if (r < 50 && g < 50 && b < 50) return 'Black';
    if (r > 150 && g < 100 && b < 100) return 'Red';
    if (r < 100 && g > 150 && b < 100) return 'Green';
    if (r < 100 && g < 100 && b > 150) return 'Blue';
    if (r > 150 && g > 150 && b < 100) return 'Yellow';
    if (r > 150 && g < 100 && b > 150) return 'Magenta';
    if (r < 100 && g > 150 && b > 150) return 'Cyan';
    if (r > 100 && g > 100 && b > 100) return 'Gray';
    if (r > 139 && g > 69 && b < 60) return 'Brown';
    if (r > 200 && g > 165 && b < 120) return 'Beige';

    return 'Mixed';
  };

  const analyzeColor = async (extractedColors: ExtractedColor[]) => {
    if (extractedColors.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Simulate color analysis API call
      // In a real implementation, this would call an AI service for color matching

      const dominantColor = extractedColors[0];

      // Mock color analysis data
      const mockAnalysis: ColorAnalysis = {
        dominant_colors: extractedColors,
        suggested_matches: [
          {
            product_id: 'TILE001',
            product_key: 'CER-WHT-12X12-MAT',
            tile_color: 'Pure White',
            brand: 'TilePro',
            collection: 'Modern Classics',
            tile_type: 'Ceramic',
            tile_size: '12x12',
            hex_color: dominantColor.hex,
            rgb_values: dominantColor.rgb,
            color_difference: 5.2,
            similarity_percentage: 94.8,
            price: 3.25,
            available_quantity: 450,
          },
          {
            product_id: 'TILE002',
            product_key: 'POR-CRM-24X24-POL',
            tile_color: 'Cream Marble',
            brand: 'CeramicCraft',
            collection: 'Marble Collection',
            tile_type: 'Porcelain',
            tile_size: '24x24',
            hex_color: adjustHex(dominantColor.hex, 10),
            rgb_values: adjustRgb(dominantColor.rgb, 10),
            color_difference: 12.1,
            similarity_percentage: 87.9,
            price: 5.75,
            available_quantity: 280,
          },
          {
            product_id: 'TILE003',
            product_key: 'NAT-BEI-18X18-TEXT',
            tile_color: 'Natural Beige',
            brand: 'StoneWorks',
            collection: 'Natural Stone',
            tile_type: 'Natural Stone',
            tile_size: '18x18',
            hex_color: adjustHex(dominantColor.hex, 20),
            rgb_values: adjustRgb(dominantColor.rgb, 20),
            color_difference: 18.5,
            similarity_percentage: 81.5,
            price: 8.99,
            available_quantity: 150,
          },
        ],
        analysis: {
          primary_color_family: getColorFamily(dominantColor.rgb),
          secondary_colors: extractedColors.slice(1, 3).map((c) => c.name),
          brightness_level: getBrightnessLevel(dominantColor.rgb),
          saturation_level: getSaturationLevel(dominantColor.rgb),
          temperature: getColorTemperature(dominantColor.rgb),
        },
      };

      setColorAnalysis(mockAnalysis);
      toast.success('Color analysis completed');
    } catch (error) {
      console.error('Color analysis error:', error);
      toast.error('Error analyzing color');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const adjustHex = (hex: string, amount: number): string => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return rgbToHex(r, g, b);
  };

  const adjustRgb = (
    rgb: { r: number; g: number; b: number },
    amount: number
  ) => ({
    r: Math.min(255, Math.max(0, rgb.r + amount)),
    g: Math.min(255, Math.max(0, rgb.g + amount)),
    b: Math.min(255, Math.max(0, rgb.b + amount)),
  });

  const getColorFamily = (rgb: { r: number; g: number; b: number }): string => {
    const { r, g, b } = rgb;
    if (r > g && r > b) return 'Red Family';
    if (g > r && g > b) return 'Green Family';
    if (b > r && b > g) return 'Blue Family';
    if (r === g && r > b) return 'Yellow Family';
    if (r === b && r > g) return 'Magenta Family';
    if (g === b && g > r) return 'Cyan Family';
    return 'Neutral Family';
  };

  const getBrightnessLevel = (rgb: {
    r: number;
    g: number;
    b: number;
  }): string => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    if (brightness > 200) return 'Very Bright';
    if (brightness > 150) return 'Bright';
    if (brightness > 100) return 'Medium';
    if (brightness > 50) return 'Dark';
    return 'Very Dark';
  };

  const getSaturationLevel = (rgb: {
    r: number;
    g: number;
    b: number;
  }): string => {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (saturation > 0.8) return 'Highly Saturated';
    if (saturation > 0.6) return 'Saturated';
    if (saturation > 0.4) return 'Moderately Saturated';
    if (saturation > 0.2) return 'Low Saturation';
    return 'Desaturated';
  };

  const getColorTemperature = (rgb: {
    r: number;
    g: number;
    b: number;
  }): string => {
    const { r, g, b } = rgb;
    if (r > b + 20) return 'Warm';
    if (b > r + 20) return 'Cool';
    return 'Neutral';
  };

  const handleImageClick = async (
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    if (analysisMethod !== 'manual' || !uploadedImage) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    setClickPosition({ x, y });

    const extractedColors = await extractColorFromImage(uploadedImage, x, y);
    if (extractedColors.length > 0) {
      setSelectedColor(extractedColors[0]);
      await analyzeColor(extractedColors);
    }
  };

  const handleAutoAnalysis = async () => {
    if (!uploadedImage) return;

    const extractedColors = await extractColorFromImage(uploadedImage);
    await analyzeColor(extractedColors);
  };

  const getSimilarityColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Color Matching Tool
        </h2>
        <div className="text-sm text-gray-500">
          Upload photos to find matching tile colors
        </div>
      </div>

      {/* Upload Section */}
      <Card
        title="Upload Image"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              behavior="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white"
            >
              Upload Image
            </Button>
            <SelectField
              value={analysisMethod}
              onValueChange={(value) =>
                setAnalysisMethod(value as 'auto' | 'manual')
              }
              customSelector
            >
              <option value="auto">Auto Analysis</option>
              <option value="manual">Click to Select Color</option>
            </SelectField>
            {uploadedImage && (
              <Button
                behavior="button"
                onClick={handleAutoAnalysis}
                disabled={isAnalyzing}
                className="bg-green-600 text-white"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Colors'}
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="text-sm text-gray-600">
            <p>• Supported formats: JPG, PNG, GIF</p>
            <p>• Best results with well-lit, clear images</p>
            {analysisMethod === 'manual' && (
              <p>
                • Click on any part of the image to extract that specific color
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Image Display */}
      {uploadedImage && (
        <Card
          title="Uploaded Image"
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className={`max-w-full max-h-96 rounded-lg shadow-md ${
                  analysisMethod === 'manual' ? 'cursor-crosshair' : ''
                }`}
                onClick={handleImageClick}
              />
              {clickPosition && (
                <div
                  className="absolute w-4 h-4 border-2 border-red-500 rounded-full -translate-x-2 -translate-y-2 pointer-events-none"
                  style={{
                    left: clickPosition.x,
                    top: clickPosition.y,
                  }}
                />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </Card>
      )}

      {/* Color Analysis Results */}
      {colorAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Extracted Colors */}
          <Card
            title="Extracted Colors"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              {colorAnalysis.dominant_colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{color.name}</div>
                    <div className="text-sm text-gray-600">{color.hex}</div>
                    <div className="text-xs text-gray-500">
                      RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {color.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Color Analysis */}
          <Card
            title="Color Analysis"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Color Family:</span>
                <span className="font-medium">
                  {colorAnalysis.analysis.primary_color_family}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-medium">
                  {colorAnalysis.analysis.temperature}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brightness:</span>
                <span className="font-medium">
                  {colorAnalysis.analysis.brightness_level}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturation:</span>
                <span className="font-medium">
                  {colorAnalysis.analysis.saturation_level}
                </span>
              </div>
              {colorAnalysis.analysis.secondary_colors.length > 0 && (
                <div>
                  <span className="text-gray-600">Secondary Colors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {colorAnalysis.analysis.secondary_colors.map(
                      (color, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Filters */}
          <Card
            title="Filter Results"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              <InputField
                placeholder="Max price ($)"
                type="number"
                value={filters.max_price}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, max_price: value }))
                }
              />
              <InputField
                placeholder="Min quantity"
                type="number"
                value={filters.min_quantity}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, min_quantity: value }))
                }
              />
              <SelectField
                value={filters.tile_type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, tile_type: value }))
                }
                customSelector
              >
                <option value="">All Types</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Porcelain">Porcelain</option>
                <option value="Natural Stone">Natural Stone</option>
              </SelectField>
              <SelectField
                value={filters.brand}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, brand: value }))
                }
                customSelector
              >
                <option value="">All Brands</option>
                <option value="TilePro">TilePro</option>
                <option value="CeramicCraft">CeramicCraft</option>
                <option value="StoneWorks">StoneWorks</option>
              </SelectField>
            </div>
          </Card>
        </div>
      )}

      {/* Matching Results */}
      {colorAnalysis && (
        <Card
          title="Matching Tile Products"
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorAnalysis.suggested_matches.map((match, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: match.hex_color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {match.product_key}
                    </div>
                    <div className="text-sm text-gray-600">
                      {match.tile_color}
                    </div>
                    <div className="text-xs text-gray-500">
                      {match.brand} - {match.collection}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Similarity:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getSimilarityColor(
                        match.similarity_percentage
                      )}`}
                    >
                      {match.similarity_percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-medium">${match.price}/sq ft</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="font-medium">
                      {match.available_quantity} sq ft
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="font-medium">{match.tile_size}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Button
                    behavior="button"
                    onClick={() =>
                      toast.success(`Added ${match.product_key} to comparison`)
                    }
                    className="w-full text-sm bg-blue-600 text-white"
                  >
                    Add to Comparison
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
