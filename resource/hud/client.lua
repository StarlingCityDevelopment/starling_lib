local GetAspectRatio = GetAspectRatio
local GetActualScreenResolution = GetActualScreenResolution
local GetScriptGfxPosition = GetScriptGfxPosition
local SetScriptGfxAlign = SetScriptGfxAlign
local ResetScriptGfxAlign = ResetScriptGfxAlign

local screenWidth, screenHeight = GetActualScreenResolution()
local currentMapShape = exports.sc_hud:CurrentMapShape()

local function getMinimapDimensions()
    SetScriptGfxAlign(string.byte("L"), string.byte("B"))

    local currentScreenWidth, currentScreenHeight = GetActualScreenResolution()
    local aspectRatio = GetAspectRatio(false)
    local widthScale = 1 / currentScreenWidth
    local heightScale = 1 / currentScreenHeight

    local mapShape = currentMapShape
    if mapShape == "rectangle" then
        local posX, posY = GetScriptGfxPosition(0.0, -0.237)
        if currentScreenWidth ~= screenWidth or currentScreenHeight ~= screenHeight then
            screenWidth = currentScreenWidth
            screenHeight = currentScreenHeight
        end

        ResetScriptGfxAlign()

        local leftPct = posX * 100
        local topPct = posY * 100 - (cache.vehicle and 55 or 30)

        local dimensions = {
            width = widthScale * (currentScreenWidth / (3.48 * aspectRatio)),
            height = heightScale * (currentScreenHeight / 5.55),
            interfaceDimensions = {
                width = (widthScale * (currentScreenWidth / (3.48 * aspectRatio))) * currentScreenWidth,
                height = (heightScale * (currentScreenHeight / 5.55)) * currentScreenHeight,
                left = leftPct,
                top = topPct,
            }
        }

        return dimensions
    end

    local posX, posY = GetScriptGfxPosition(0.0, -0.261)
    if currentScreenWidth ~= screenWidth or currentScreenHeight ~= screenHeight then
        screenWidth = currentScreenWidth
        screenHeight = currentScreenHeight
    end

    local leftPct = posX * 100
        local topPct = posY * 100 - (cache.vehicle and 55 or 30)

    local dimensions = {
        width = widthScale * (currentScreenWidth / (3.9 * aspectRatio)),
        height = heightScale * (currentScreenHeight / 4.8),
        interfaceDimensions = {
            width = (widthScale * (currentScreenWidth / (3.9 * aspectRatio))) * currentScreenWidth,
            height = (heightScale * (currentScreenHeight / 4.8)) * currentScreenHeight,
            left = leftPct,
            top = topPct,
        }
    }

    ResetScriptGfxAlign()
    return dimensions
end

CreateThread(function()
    while true do
        local minimap = getMinimapDimensions()

        SendNUIMessage({
            action = 'setNotifyPosition',
            data = {
                top = minimap.interfaceDimensions.top,
                left = minimap.interfaceDimensions.left,
                width = minimap.interfaceDimensions.width,
                height = minimap.interfaceDimensions.height
            }
        })

        Wait(1000)
    end
end)
