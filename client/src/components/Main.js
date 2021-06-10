import React from 'react';
import styled, { css } from 'styled-components'
import ImageGrid from './ImageGrid'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderTitleBar() {
        const Title = styled.h1`
                font-size: 1.5em;
                text-align: center;
                color: DarkSlateGray;
                `;

        const Wrapper = styled.section`
                padding: 2em;
                background: Azure;
                `;

        return (
            <Wrapper>
                <Title>
                    Image Sharing Service
                </Title>
            </Wrapper>
        );
    }

    render() {
        const renderTitleBar = this.renderTitleBar()
        return (
            <div>
                {renderTitleBar}
                <ImageGrid />
            </div>
        );
    }
}

export default Main;