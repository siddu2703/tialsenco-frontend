/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Element } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { SelectField } from '$app/components/forms/SelectField';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface ColorMatch {
  product_id: string;
  product_key: string;
  tile_color: string;
  brand: string;
  collection: string;
  hex_color: string;
  similarity_percentage: number;
  price: number;
  tile_size: string;
}

interface TilePattern {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  difficulty_level: 'Easy' | 'Medium' | 'Hard';
  wastage_factor: number;
}

interface ARSession {
  session_id: string;
  room_image: string;
  selected_tile: string;
  applied_pattern: string;
  preview_url: string;
  created_at: string;
}

export default function ARVisualization() {
  const [t] = useTranslation();
  const colors = useColorScheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeTab, setActiveTab] = useState<
    'color-matching' | '3d-visualizer' | 'ar-preview'
  >('color-matching');

  // Color Matching State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorMatches, setColorMatches] = useState<ColorMatch[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');

  // 3D Visualizer State
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [visualizationResult, setVisualizationResult] = useState<string | null>(
    null
  );

  // AR Preview State
  const [isARActive, setIsARActive] = useState(false);
  const [arSupported, setARSupported] = useState(true);
  const [arSessions, setARSessions] = useState<ARSession[]>([]);

  // Tile patterns data
  const tilePatterns: TilePattern[] = [
    {
      id: 'straight',
      name: 'Straight/Grid',
      description:
        'Classic grid pattern with tiles aligned in rows and columns',
      preview_url: '/patterns/straight.svg',
      difficulty_level: 'Easy',
      wastage_factor: 5,
    },
    {
      id: 'offset',
      name: 'Offset/Brick',
      description: 'Brick-like pattern with each row offset by half a tile',
      preview_url: '/patterns/offset.svg',
      difficulty_level: 'Easy',
      wastage_factor: 8,
    },
    {
      id: 'herringbone',
      name: 'Herringbone',
      description: 'V-shaped pattern creating a distinctive zigzag effect',
      preview_url: '/patterns/herringbone.svg',
      difficulty_level: 'Medium',
      wastage_factor: 15,
    },
    {
      id: 'diagonal',
      name: 'Diagonal',
      description: 'Tiles laid at 45-degree angle for dynamic look',
      preview_url: '/patterns/diagonal.svg',
      difficulty_level: 'Medium',
      wastage_factor: 12,
    },
    {
      id: 'basketweave',
      name: 'Basketweave',
      description: 'Alternating pattern mimicking woven baskets',
      preview_url: '/patterns/basketweave.svg',
      difficulty_level: 'Hard',
      wastage_factor: 20,
    },
    {
      id: 'versailles',
      name: 'Versailles',
      description: 'Complex French pattern with multiple tile sizes',
      preview_url: '/patterns/versailles.svg',
      difficulty_level: 'Hard',
      wastage_factor: 25,
    },
  ];

  // Sample tile data
  const sampleTiles = [
    {
      id: 'TILE001',
      name: 'Marble White 24x24',
      color: '#f8f8f8',
      pattern: 'marble',
    },
    {
      id: 'TILE002',
      name: 'Charcoal Gray 12x12',
      color: '#4a4a4a',
      pattern: 'solid',
    },
    {
      id: 'TILE003',
      name: 'Natural Beige 18x18',
      color: '#d4c5a9',
      pattern: 'textured',
    },
    {
      id: 'TILE004',
      name: 'Ocean Blue 6x6',
      color: '#4682b4',
      pattern: 'glossy',
    },
    {
      id: 'TILE005',
      name: 'Terracotta Red 12x24',
      color: '#cd853f',
      pattern: 'rustic',
    },
  ];

  // Color Matching Functions
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
      if (activeTab === 'color-matching') {
        analyzeImageColors(result);
      } else if (activeTab === '3d-visualizer') {
        setRoomImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImageColors = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate color analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockMatches: ColorMatch[] = [
        {
          product_id: 'TILE001',
          product_key: 'MAR-WHT-24X24',
          tile_color: 'Marble White',
          brand: 'TilePro',
          collection: 'Marble Collection',
          hex_color: '#f8f8f8',
          similarity_percentage: 94.5,
          price: 8.99,
          tile_size: '24x24',
        },
        {
          product_id: 'TILE002',
          product_key: 'CER-BEI-12X12',
          tile_color: 'Ceramic Beige',
          brand: 'CeramicCraft',
          collection: 'Earth Tones',
          hex_color: '#d4c5a9',
          similarity_percentage: 87.2,
          price: 5.49,
          tile_size: '12x12',
        },
        {
          product_id: 'TILE003',
          product_key: 'POR-GRY-18X18',
          tile_color: 'Charcoal Gray',
          brand: 'StoneWorks',
          collection: 'Modern Series',
          hex_color: '#4a4a4a',
          similarity_percentage: 82.8,
          price: 6.75,
          tile_size: '18x18',
        },
      ];

      setColorMatches(mockMatches);
      toast.success('Color analysis completed!');
    } catch (error) {
      toast.error('Error analyzing colors');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3D Visualizer Functions
  const handleVisualize = async () => {
    if (!roomImage || !selectedTile || !selectedPattern) {
      toast.error('Please select room image, tile, and pattern');
      return;
    }

    setIsRendering(true);
    try {
      // Simulate 3D rendering
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // In a real implementation, this would call an AI service to overlay tiles
      setVisualizationResult(roomImage); // Placeholder - would be the rendered result
      toast.success('3D visualization completed!');
    } catch (error) {
      toast.error('Error generating visualization');
    } finally {
      setIsRendering(false);
    }
  };

  // AR Functions
  const startARSession = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setARSupported(false);
        toast.error('AR not supported on this device');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsARActive(true);
        toast.success('AR session started! Point camera at your room');
      }
    } catch (error) {
      toast.error('Failed to start AR session');
      setARSupported(false);
    }
  };

  const stopARSession = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
  };

  const captureARSession = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const capturedImage = canvas.toDataURL('image/png');

    const newSession: ARSession = {
      session_id: Date.now().toString(),
      room_image: capturedImage,
      selected_tile: selectedTile,
      applied_pattern: selectedPattern,
      preview_url: capturedImage,
      created_at: new Date().toLocaleString(),
    };

    setARSessions((prev) => [newSession, ...prev]);
    toast.success('AR session captured!');
  };

  const getSimilarityColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (level: string): string => {
    switch (level) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          AR & Visualization Studio
        </h2>
        <div className="text-sm text-gray-500">
          Advanced tile visualization and AR preview tools
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('color-matching')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'color-matching'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎨 Color Matching
          </button>
          <button
            onClick={() => setActiveTab('3d-visualizer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === '3d-visualizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏠 3D Visualizer
          </button>
          <button
            onClick={() => setActiveTab('ar-preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ar-preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📱 AR Preview
          </button>
        </nav>
      </div>

      {/* Color Matching Tab */}
      {activeTab === 'color-matching' && (
        <div className="space-y-6">
          <Card
            title="AI Color Matching"
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
                <div className="text-sm text-gray-600">
                  Upload photos to find matching tile colors automatically
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage && (
                <div className="text-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full max-h-64 rounded-lg shadow-md mx-auto"
                  />
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="mt-4 text-gray-600">
                    Analyzing colors with AI...
                  </div>
                </div>
              )}
            </div>
          </Card>

          {colorMatches.length > 0 && (
            <Card
              title="Color Match Results"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorMatches.map((match, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: match.hex_color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{match.product_key}</div>
                        <div className="text-sm text-gray-600">
                          {match.tile_color}
                        </div>
                        <div className="text-xs text-gray-500">
                          {match.brand}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Match:</span>
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
                        <span className="font-medium">
                          ${match.price}/sq ft
                        </span>
                      </div>
                    </div>

                    <Button
                      behavior="button"
                      onClick={() => {
                        setSelectedTile(match.product_id);
                        setActiveTab('3d-visualizer');
                        toast.success('Tile selected for visualization');
                      }}
                      className="w-full mt-3 text-sm bg-blue-600 text-white"
                    >
                      Use in 3D Visualizer
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 3D Visualizer Tab */}
      {activeTab === '3d-visualizer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Room Setup"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-4">
                <Button
                  behavior="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 text-white"
                >
                  Upload Room Photo
                </Button>

                {roomImage && (
                  <div className="text-center">
                    <img
                      src={roomImage}
                      alt="Room"
                      className="max-w-full max-h-48 rounded-lg shadow-md mx-auto"
                    />
                  </div>
                )}

                <Element leftSide="Select Tile">
                  <SelectField
                    value={selectedTile}
                    onValueChange={setSelectedTile}
                    customSelector
                  >
                    <option value="">Choose a tile...</option>
                    {sampleTiles.map((tile) => (
                      <option key={tile.id} value={tile.id}>
                        {tile.name}
                      </option>
                    ))}
                  </SelectField>
                </Element>

                <Element leftSide="Laying Pattern">
                  <SelectField
                    value={selectedPattern}
                    onValueChange={setSelectedPattern}
                    customSelector
                  >
                    <option value="">Choose pattern...</option>
                    {tilePatterns.map((pattern) => (
                      <option key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </option>
                    ))}
                  </SelectField>
                </Element>

                <Button
                  behavior="button"
                  onClick={handleVisualize}
                  disabled={
                    isRendering ||
                    !roomImage ||
                    !selectedTile ||
                    !selectedPattern
                  }
                  className="w-full bg-green-600 text-white"
                >
                  {isRendering ? 'Rendering...' : 'Generate 3D Visualization'}
                </Button>
              </div>
            </Card>

            <Card
              title="Tile Patterns"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="grid grid-cols-1 gap-3">
                {tilePatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPattern === pattern.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPattern(pattern.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-sm text-gray-600">
                          {pattern.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                              pattern.difficulty_level
                            )}`}
                          >
                            {pattern.difficulty_level}
                          </span>
                          <span className="text-xs text-gray-500">
                            +{pattern.wastage_factor}% wastage
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {isRendering && (
            <Card
              className="shadow-sm text-center py-8"
              style={{ borderColor: colors.$24 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
              <div className="mt-4 text-gray-600">
                Generating 3D visualization...
              </div>
              <div className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </div>
            </Card>
          )}

          {visualizationResult && (
            <Card
              title="3D Visualization Result"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="text-center">
                <img
                  src={visualizationResult}
                  alt="3D Visualization"
                  className="max-w-full rounded-lg shadow-lg mx-auto"
                />
                <div className="mt-4 space-x-4">
                  <Button
                    behavior="button"
                    onClick={() => toast.success('Visualization saved!')}
                    className="bg-blue-600 text-white"
                  >
                    Save Visualization
                  </Button>
                  <Button
                    behavior="button"
                    onClick={() => {
                      setActiveTab('ar-preview');
                      toast.success('Switched to AR mode');
                    }}
                    className="bg-purple-600 text-white"
                  >
                    Try in AR
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* AR Preview Tab */}
      {activeTab === 'ar-preview' && (
        <div className="space-y-6">
          <Card
            title="Augmented Reality Preview"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            {!arSupported ? (
              <div className="text-center py-8">
                <div className="text-red-600 text-lg font-medium mb-2">
                  AR Not Supported
                </div>
                <div className="text-gray-600">
                  Your device or browser doesn't support AR features
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Try using a mobile device with a modern browser
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!isARActive ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-lg font-medium mb-2">
                      Start AR Session
                    </div>
                    <div className="text-gray-600 mb-4">
                      Point your camera at the room to see tiles in real-time
                    </div>
                    <Button
                      behavior="button"
                      onClick={startARSession}
                      className="bg-purple-600 text-white"
                    >
                      Start AR Preview
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                        style={{ maxHeight: '400px' }}
                      />

                      {/* AR Overlay UI */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                        <Button
                          behavior="button"
                          onClick={captureARSession}
                          className="bg-white text-gray-800 border border-gray-300"
                        >
                          📸 Capture
                        </Button>
                        <Button
                          behavior="button"
                          onClick={stopARSession}
                          className="bg-red-600 text-white"
                        >
                          Stop AR
                        </Button>
                      </div>

                      {/* AR Controls */}
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 space-y-2">
                        <div className="text-sm font-medium">AR Controls</div>
                        <SelectField
                          value={selectedTile}
                          onValueChange={setSelectedTile}
                          customSelector
                        >
                          <option value="">Select Tile</option>
                          {sampleTiles.map((tile) => (
                            <option key={tile.id} value={tile.id}>
                              {tile.name}
                            </option>
                          ))}
                        </SelectField>
                        <SelectField
                          value={selectedPattern}
                          onValueChange={setSelectedPattern}
                          customSelector
                        >
                          <option value="">Select Pattern</option>
                          {tilePatterns.slice(0, 3).map((pattern) => (
                            <option key={pattern.id} value={pattern.id}>
                              {pattern.name}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {arSessions.length > 0 && (
            <Card
              title="Captured AR Sessions"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <img
                      src={session.preview_url}
                      alt="AR Session"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Tile:</span>{' '}
                        {session.selected_tile}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Pattern:</span>{' '}
                        {session.applied_pattern}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.created_at}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          behavior="button"
                          onClick={() => toast.success('Session shared!')}
                          className="flex-1 text-xs bg-blue-600 text-white"
                        >
                          Share
                        </Button>
                        <Button
                          behavior="button"
                          onClick={() => toast.success('Session saved!')}
                          className="flex-1 text-xs bg-green-600 text-white"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
